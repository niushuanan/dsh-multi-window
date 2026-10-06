import type { SessionId } from '@deepseek-ai/dsh-session/types';
import type { AuxiliaryPaneOpener } from '@deepseek-ai/dsh-client-ui-workspace/client';
export declare const MAX_DSH_PANES = 4;
/** Compatibility export for profiles that still import the old technical name. */
export declare const MAX_DSH_WINDOWS = 4;
export interface ConversationPane {
    readonly paneId: string;
    readonly sessionId: SessionId;
}
export interface MultiPaneSnapshot {
    readonly panes: readonly ConversationPane[];
    readonly currentSessionId?: SessionId;
    readonly count: number;
    readonly atLimit: boolean;
}
/** Compatibility alias retained for existing plugin consumers. */
export type MultiWindowSnapshot = MultiPaneSnapshot;
export type OpenPaneResult = 'opened' | 'visible' | 'limit';
/** Compatibility alias retained for existing plugin consumers. */
export type OpenWindowResult = OpenPaneResult;
/** Minimal native face other plugins use without taking ownership of split layout. */
export interface MultiPaneService extends AuxiliaryPaneOpener {
    canOpenSession(sessionId?: SessionId): boolean | Promise<boolean>;
    openSession(sessionId: SessionId): OpenPaneResult | Promise<OpenPaneResult>;
}
export interface MultiPaneEnvironment {
    storage: Pick<Storage, 'getItem' | 'setItem'>;
    randomId: () => string;
    setSplitActive: (active: boolean) => void;
}
/** Compatibility alias retained for existing plugin consumers. */
export type MultiWindowEnvironment = MultiPaneEnvironment;
/** Owns the page's secondary conversation panes and their persisted identities. */
export declare class MultiPaneCoordinator implements MultiPaneService {
    private readonly environment;
    private readonly listeners;
    private started;
    private snapshot;
    constructor(environment?: MultiPaneEnvironment);
    readonly getSnapshot: () => MultiPaneSnapshot;
    readonly subscribe: (listener: () => void) => (() => void);
    start(): () => void;
    stop(): void;
    sync(currentSessionId: SessionId | undefined, validSessionIds: ReadonlySet<SessionId>): void;
    canOpenSession(sessionId?: SessionId): boolean;
    openSession(sessionId: SessionId): OpenPaneResult;
    closePane(paneId: string): void;
    private publish;
}
/** Compatibility class name retained while the product moves from windows to panes. */
export declare class MultiWindowCoordinator extends MultiPaneCoordinator {
}
//# sourceMappingURL=coordinator.d.ts.map