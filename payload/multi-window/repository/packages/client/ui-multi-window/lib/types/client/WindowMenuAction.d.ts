import type { SessionId } from '@deepseek-ai/dsh-client-runtime/client';
import type { MultiWindowCoordinator } from './coordinator.ts';
import type { MultiWindowLocaleKey } from './locales.ts';
export interface WindowMenuActionProps {
    sessionId: SessionId;
    closeMenu: () => void;
    coordinator: MultiWindowCoordinator;
    t: (key: MultiWindowLocaleKey) => string;
}
/** Native-looking action that adds one conversation block to the current page. */
export declare function WindowMenuAction({ sessionId, closeMenu, coordinator, t }: WindowMenuActionProps): import("react").JSX.Element;
//# sourceMappingURL=WindowMenuAction.d.ts.map