import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import type { MultiPaneCoordinator } from './coordinator.ts';
interface SplitPaneInjected {
    coordinator: MultiPaneCoordinator;
}
/** Resize only the panes touching one separator, preserving every other pane. */
export declare function resizeAdjacentPanes(ratios: readonly number[], boundary: number, deltaPx: number, totalWidth: number): readonly number[];
export type SplitPaneWorkspaceProps = Pick<PropsRuntime<'shell.overlay'>, 'useSessions'> & PropsLocale<'multiWindow'> & InjectFace<SplitPaneInjected>;
/** Secondary full conversation documents sharing the primary page's workspace. */
export declare function SplitPaneWorkspace({ useSessions, coordinator, t }: SplitPaneWorkspaceProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=SplitPaneWorkspace.d.ts.map