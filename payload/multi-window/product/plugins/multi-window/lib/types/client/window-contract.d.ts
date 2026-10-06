import type { SessionId } from '@deepseek-ai/dsh-session/types';
/** Query marker carried only by windows created by this plugin. */
export declare const DSH_WINDOW_ROLE_PARAM = "dsh-window";
/** Stable identity that isolates navigation and persisted window state. */
export declare const DSH_WINDOW_ID_PARAM = "dsh-window-id";
/** Session selected when an auxiliary window first opens. */
export declare const DSH_WINDOW_SESSION_PARAM = "dsh-session";
/** Presentation marker for an auxiliary document embedded as a pane. */
export declare const DSH_WINDOW_EMBED_PARAM = "dsh-embed";
/** Drag payload shared with native Session rows. */
export declare const SESSION_DRAG_MIME = "application/x-dsh-session-id";
export interface DshWindowContext {
    role: 'primary' | 'auxiliary';
    windowId?: string;
    sessionId?: SessionId;
    embedded?: boolean;
}
/** Parse the URL-owned identity used by this plugin's auxiliary documents. */
export declare function parseDshWindowContext(search: string): DshWindowContext;
/** Current window identity; non-browser runtimes are primary. */
export declare function currentDshWindowContext(): DshWindowContext;
/** Build the isolated same-origin document used by one conversation pane. */
export declare function embeddedDshPaneUrl(currentUrl: string, paneId: string, sessionId: SessionId): string;
//# sourceMappingURL=window-contract.d.ts.map