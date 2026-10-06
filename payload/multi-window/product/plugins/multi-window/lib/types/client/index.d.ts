import type { Context as ClientContext } from '@deepseek-ai/cordis';
import type { SessionId } from '@deepseek-ai/dsh-session/types';
import { type MultiWindowLocaleKey } from './locales.ts';
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        multiWindow: MultiWindowLocaleKey;
    }
}
export { MAX_DSH_PANES, MAX_DSH_WINDOWS, MultiPaneCoordinator, MultiWindowCoordinator, } from './coordinator.ts';
export type { ConversationPane, MultiPaneEnvironment, MultiPaneSnapshot, MultiWindowEnvironment, MultiWindowSnapshot, OpenPaneResult, OpenWindowResult, MultiPaneService, } from './coordinator.ts';
export { SplitPaneWorkspace } from './SplitPaneWorkspace.tsx';
export { WindowMenuAction } from './WindowMenuAction.tsx';
export declare const inject: string[];
declare module '@deepseek-ai/cordis' {
    interface Context {
        /** Native cross-plugin request to reveal one conversation in this page's split workspace. */
        multiPane: import('./coordinator.ts').MultiPaneService;
    }
}
/** Ask the primary page whether an auxiliary selection may open another pane. */
export declare function requestParentCanOpen(sessionId?: SessionId, timeoutMs?: number): Promise<boolean>;
/** Register in-page conversation splitting and compact auxiliary pane boot. */
export declare function apply(ctx: ClientContext): void;
//# sourceMappingURL=index.d.ts.map