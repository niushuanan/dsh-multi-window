import { createElement } from 'react';
import { MultiPaneCoordinator } from "./coordinator.js";
import { SplitPaneWorkspace } from "./SplitPaneWorkspace.js";
import { WindowMenuAction } from "./WindowMenuAction.js";
import { en, NS, zh } from "./locales.js";
import { currentDshWindowContext, DSH_WINDOW_SESSION_PARAM } from "./window-contract.js";
export { MAX_DSH_PANES, MAX_DSH_WINDOWS, MultiPaneCoordinator, MultiWindowCoordinator, } from "./coordinator.js";
export { SplitPaneWorkspace } from "./SplitPaneWorkspace.js";
export { WindowMenuAction } from "./WindowMenuAction.js";
export const inject = ['sessions', 'uiSession', 'uiWorkspace', 'slots', 'locale'];
const OPEN_PANE_MESSAGE = 'dsh:multi-pane-open';
const CAN_OPEN_PANE_MESSAGE = 'dsh:multi-pane-can-open';
const OPEN_PANE_REQUEST = 'dsh:multi-pane-open-request';
const PANE_RESPONSE = 'dsh:multi-pane-response';
const PARENT_RESPONSE_TIMEOUT_MS = 2_000;
function requestParent(type, sessionId, fallback, timeoutMs) {
    const requestId = `${Date.now()}-${Math.random()}`;
    return new Promise((resolve) => {
        const finish = (value) => {
            window.clearTimeout(timeout);
            window.removeEventListener('message', receive);
            resolve(value);
        };
        const receive = (event) => {
            if (event.source !== window.parent || event.origin !== location.origin
                || typeof event.data !== 'object' || event.data === null
                || Reflect.get(event.data, 'type') !== PANE_RESPONSE
                || Reflect.get(event.data, 'requestId') !== requestId)
                return;
            finish(Reflect.get(event.data, 'result'));
        };
        const timeout = window.setTimeout(() => { finish(fallback); }, timeoutMs);
        window.addEventListener('message', receive);
        window.parent.postMessage({ type, requestId, ...sessionId === undefined ? {} : { sessionId } }, location.origin);
    });
}
/** Ask the primary page whether an auxiliary selection may open another pane. */
export function requestParentCanOpen(sessionId, timeoutMs = PARENT_RESPONSE_TIMEOUT_MS) {
    return requestParent(CAN_OPEN_PANE_MESSAGE, sessionId, false, timeoutMs);
}
function requestParentOpen(sessionId, timeoutMs = PARENT_RESPONSE_TIMEOUT_MS) {
    return requestParent(OPEN_PANE_REQUEST, sessionId, 'limit', timeoutMs);
}
function installAuxiliaryNavigation(ctx) {
    const windowContext = currentDshWindowContext();
    const target = windowContext.sessionId;
    let initialTargetOpened = target === undefined;
    const synchronize = () => {
        const snapshot = ctx.sessions.list.getSnapshot();
        if (!initialTargetOpened && target !== undefined && snapshot.byId[target] !== undefined) {
            initialTargetOpened = true;
            ctx.uiWorkspace.openSession(target);
            return;
        }
        const current = ctx.uiSession.adapter.current.getSnapshot().key;
        if (current === undefined)
            return;
        const url = new URL(location.href);
        if (url.searchParams.get(DSH_WINDOW_SESSION_PARAM) !== current) {
            url.searchParams.set(DSH_WINDOW_SESSION_PARAM, current);
            history.replaceState(history.state, '', url);
        }
        const title = snapshot.byId[current]?.displayTitle;
        if (title !== undefined && title !== '')
            document.title = `${title} · DeepSeek Harness`;
    };
    synchronize();
    ctx.effect(() => ctx.sessions.list.subscribe(synchronize), 'ui-multi-window: pane navigation');
    ctx.effect(() => ctx.uiSession.adapter.current.subscribe(synchronize), 'ui-multi-window: main view navigation');
}
/** Register in-page conversation splitting and compact auxiliary pane boot. */
export function apply(ctx) {
    ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'ui-multi-window: dictionaries');
    if (currentDshWindowContext().role === 'auxiliary') {
        ctx.provide('multiPane', {
            canOpenSession: sessionId => requestParentCanOpen(sessionId),
            openSession: sessionId => requestParentOpen(sessionId),
        });
        ctx.provide('auxiliaryPane', ctx.multiPane);
        installAuxiliaryNavigation(ctx);
        return;
    }
    const coordinator = new MultiPaneCoordinator();
    ctx.provide('multiPane', coordinator);
    ctx.provide('auxiliaryPane', coordinator);
    const synchronize = () => {
        const snapshot = ctx.sessions.list.getSnapshot();
        if (snapshot.phase !== 'ready')
            return;
        coordinator.sync(ctx.uiSession.adapter.current.getSnapshot().key, new Set(Object.keys(snapshot.byId)));
    };
    synchronize();
    ctx.effect(() => coordinator.start(), 'ui-multi-window: in-page pane coordinator');
    ctx.effect(() => {
        const receive = (event) => {
            if (event.origin !== location.origin || typeof event.data !== 'object' || event.data === null)
                return;
            const type = Reflect.get(event.data, 'type');
            const requestId = Reflect.get(event.data, 'requestId');
            const sessionId = Reflect.get(event.data, 'sessionId');
            if (type === OPEN_PANE_MESSAGE) {
                if (typeof sessionId === 'string' && sessionId !== '')
                    coordinator.openSession(sessionId);
                return;
            }
            if ((type !== CAN_OPEN_PANE_MESSAGE && type !== OPEN_PANE_REQUEST)
                || typeof requestId !== 'string' || event.source === null)
                return;
            const candidate = typeof sessionId === 'string' && sessionId !== '' ? sessionId : undefined;
            const result = type === CAN_OPEN_PANE_MESSAGE
                ? coordinator.canOpenSession(candidate)
                : candidate === undefined ? 'limit' : coordinator.openSession(candidate);
            event.source.postMessage({ type: PANE_RESPONSE, requestId, result }, event.origin);
        };
        window.addEventListener('message', receive);
        return () => { window.removeEventListener('message', receive); };
    }, 'ui-multi-window: embedded-pane open requests');
    ctx.effect(() => ctx.sessions.list.subscribe(synchronize), 'ui-multi-window: session reconciliation');
    ctx.effect(() => ctx.uiSession.adapter.current.subscribe(synchronize), 'ui-multi-window: main view reconciliation');
    ctx.slots.inject('sidebar.workspaces.session.menu.item', () => ctx.slots.register({
        name: 'sidebar.workspaces.session.menu.item',
        id: 'open-side-by-side',
        order: 10,
        locale: NS,
        inject: () => ({ coordinator }),
    }, WindowMenuAction));
    // Keep the official root's header/factory and its slot authority intact.
    // Secondary documents are siblings of that same registered component.
    ctx.slots.inject('main.conversation', () => {
        const wrapped = new WeakSet();
        const restores = [];
        const wrap = () => {
            for (const entry of ctx.slots.entries('main.conversation')) {
                const original = entry.component;
                if (wrapped.has(original))
                    continue;
                const withPanes = (props) => createElement('div', {
                    style: { display: 'flex', position: 'relative', flex: '1 1 auto', minWidth: 0, minHeight: 0, height: '100%' },
                    'data-dsh-split-workspace': '',
                }, createElement('div', {
                    style: { display: 'flex', flexDirection: 'column', flex: '1 1 0', minWidth: 0, minHeight: 0 },
                }, createElement(original, props)), createElement(SplitPaneWorkspace, {
                    useSessions: props.useSessions,
                    coordinator,
                    t: ctx.locale.bind(NS),
                }));
                wrapped.add(withPanes);
                entry.component = withPanes;
                restores.push(() => { if (entry.component === withPanes)
                    entry.component = original; });
            }
        };
        wrap();
        const off = ctx.on('slots/changed', key => { if (key === 'main.conversation')
            wrap(); });
        return () => { off(); for (const restore of restores)
            restore(); };
    });
}
//# sourceMappingURL=index.js.map