import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useSyncExternalStore } from 'react';
import { MenuItemButton } from '@deepseek-ai/dsh-client-ui-primitives';
function SplitPaneIcon() {
    return (_jsxs("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", "aria-hidden": "true", children: [_jsx("rect", { x: "1.75", y: "2.25", width: "5.25", height: "11.5", rx: "1.5", stroke: "currentColor", strokeWidth: "1.5" }), _jsx("rect", { x: "9", y: "2.25", width: "5.25", height: "11.5", rx: "1.5", stroke: "currentColor", strokeWidth: "1.5" })] }));
}
/** Native-looking action that adds one conversation block to the current page. */
export function WindowMenuAction({ sessionId, closeMenu, useMenuOpenState, coordinator, t }) {
    const setMenuOpen = useMenuOpenState?.()[1];
    const snapshot = useSyncExternalStore(coordinator.subscribe, coordinator.getSnapshot, coordinator.getSnapshot);
    const visible = snapshot.currentSessionId === sessionId
        || snapshot.panes.some(pane => pane.sessionId === sessionId);
    return (_jsx(MenuItemButton, { icon: _jsx(SplitPaneIcon, {}), disabled: visible || snapshot.atLimit, onSelect: () => {
            const result = coordinator.openSession(sessionId);
            if (result === 'opened') {
                setMenuOpen?.(false);
                closeMenu?.();
            }
        }, children: _jsx("span", { title: snapshot.atLimit ? t('action.limit') : undefined, children: visible ? t('action.visible') : t('action.open') }) }));
}
//# sourceMappingURL=WindowMenuAction.js.map