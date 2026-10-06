window.__ModuleLoader__.load({
	id: "@deepseek-ai/dsh-client-ui-multi-window",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let _deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
		let react_jsx_runtime = require("react/jsx-runtime");
		//#region ../../packages/util/crypto/src/index.ts
		/**
		* Random v4 UUID, minted from `crypto.getRandomValues`.
		* @returns the UUID string.
		*/
		function randomUUID() {
			const bytes = globalThis.crypto.getRandomValues(new Uint8Array(16));
			const hex = Array.from(bytes, (byte, index) => {
				return (index === 6 ? byte & 15 | 64 : index === 8 ? byte & 63 | 128 : byte).toString(16).padStart(2, "0");
			}).join("");
			return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
		}
		//#endregion
		//#region src/client/coordinator.ts
		const MAX_DSH_PANES = 4;
		/** Compatibility export for profiles that still import the old technical name. */
		const MAX_DSH_WINDOWS = 4;
		const STORAGE_KEY = "dsh.multi-pane.sessions";
		function browserEnvironment() {
			return {
				storage: localStorage,
				randomId: randomUUID,
				setSplitActive: (active) => {
					if (active) document.documentElement.dataset.dshSplitPanes = "true";
					else delete document.documentElement.dataset.dshSplitPanes;
				}
			};
		}
		function readPanes(storage) {
			try {
				const value = JSON.parse(storage.getItem(STORAGE_KEY) ?? "[]");
				if (!Array.isArray(value)) return [];
				return value.flatMap((item) => {
					if (typeof item !== "object" || item === null) return [];
					const paneId = Reflect.get(item, "paneId");
					const sessionId = Reflect.get(item, "sessionId");
					return typeof paneId === "string" && paneId !== "" && typeof sessionId === "string" && sessionId !== "" ? [{
						paneId,
						sessionId
					}] : [];
				}).slice(0, 3);
			} catch {
				return [];
			}
		}
		/** Owns the page's secondary conversation panes and their persisted identities. */
		var MultiPaneCoordinator = class {
			environment;
			listeners = /* @__PURE__ */ new Set();
			started = false;
			snapshot;
			constructor(environment = browserEnvironment()) {
				this.environment = environment;
				const panes = readPanes(environment.storage);
				this.snapshot = {
					panes,
					count: 1 + panes.length,
					atLimit: 1 + panes.length >= 4
				};
			}
			getSnapshot = () => this.snapshot;
			subscribe = (listener) => {
				this.listeners.add(listener);
				return () => {
					this.listeners.delete(listener);
				};
			};
			start() {
				this.started = true;
				this.environment.setSplitActive(this.snapshot.panes.length > 0);
				return () => {
					this.stop();
				};
			}
			stop() {
				if (!this.started) return;
				this.started = false;
				this.environment.setSplitActive(false);
			}
			sync(currentSessionId, validSessionIds) {
				const seen = /* @__PURE__ */ new Set();
				const panes = this.snapshot.panes.filter((pane) => {
					if (!validSessionIds.has(pane.sessionId) || pane.sessionId === currentSessionId || seen.has(pane.sessionId)) return false;
					seen.add(pane.sessionId);
					return true;
				}).slice(0, 3);
				this.publish(panes, currentSessionId);
			}
			canOpenSession(sessionId) {
				if (sessionId === this.snapshot.currentSessionId || this.snapshot.panes.some((pane) => pane.sessionId === sessionId)) return true;
				return !this.snapshot.atLimit;
			}
			openSession(sessionId) {
				if (sessionId === this.snapshot.currentSessionId || this.snapshot.panes.some((pane) => pane.sessionId === sessionId)) return "visible";
				if (this.snapshot.atLimit) return "limit";
				const panes = [...this.snapshot.panes, {
					paneId: this.environment.randomId(),
					sessionId
				}];
				this.publish(panes, this.snapshot.currentSessionId);
				return "opened";
			}
			closePane(paneId) {
				this.publish(this.snapshot.panes.filter((pane) => pane.paneId !== paneId), this.snapshot.currentSessionId);
			}
			publish(panes, currentSessionId) {
				if (currentSessionId === this.snapshot.currentSessionId && panes.length === this.snapshot.panes.length && panes.every((pane, index) => {
					const previous = this.snapshot.panes[index];
					return previous?.paneId === pane.paneId && previous.sessionId === pane.sessionId;
				})) return;
				this.snapshot = {
					panes,
					...currentSessionId === void 0 ? {} : { currentSessionId },
					count: 1 + panes.length,
					atLimit: 1 + panes.length >= 4
				};
				this.environment.storage.setItem(STORAGE_KEY, JSON.stringify(panes));
				if (this.started) this.environment.setSplitActive(panes.length > 0);
				for (const listener of this.listeners) listener();
			}
		};
		/** Compatibility class name retained while the product moves from windows to panes. */
		var MultiWindowCoordinator = class extends MultiPaneCoordinator {};
		//#endregion
		//#region \0dsh-css:/Users/zhuanghongkai/Desktop/迭代DSH/xiaozhuang-dsh-upgrade-20261006/plugins/multi-window/src/client/SplitPaneWorkspace.module.css.mjs
		const css = "._7tcgUG_group{--dsh-secondary-pane-count:1;grid-template-columns:repeat(var(--dsh-secondary-pane-count), minmax(0, 1fr));border-left:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-base);flex:none;min-width:0;min-height:0;display:grid;position:relative}._7tcgUG_group[data-empty]:not([data-drop-active]){display:none}._7tcgUG_group[data-drop-active]{z-index:8;border:1px solid var(--dsw-alias-state-business-primary);background:color-mix(in srgb, var(--dsw-alias-bg-base) 92%, var(--dsw-alias-state-business-primary));border-radius:12px;display:grid;position:absolute;inset:8px;box-shadow:0 8px 28px #0000001a}._7tcgUG_dropOverlay{z-index:8;border-radius:inherit;color:var(--dsw-alias-state-business-primary);background:color-mix(in srgb, var(--dsw-alias-bg-base) 88%, transparent);pointer-events:none;backdrop-filter:blur(4px);justify-content:center;align-items:center;gap:8px;font-size:14px;font-weight:500;display:flex;position:absolute;inset:0}._7tcgUG_dropIcon{fill:none;stroke:currentColor;stroke-width:1.35px;stroke-linecap:round;stroke-linejoin:round;width:20px;height:20px}._7tcgUG_pane{background:var(--dsw-alias-bg-base);min-width:0;min-height:0;position:relative;overflow:hidden}._7tcgUG_pane+._7tcgUG_pane{border-left:1px solid var(--dsw-alias-border-l2)}._7tcgUG_frame{background:var(--dsw-alias-bg-base);border:0;width:100%;height:100%;display:block}._7tcgUG_resizer{z-index:4;cursor:col-resize;touch-action:none;width:10px;margin-left:-5px;position:absolute;top:0;bottom:0}._7tcgUG_resizer:after{content:\"\";border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-base);opacity:0;border-radius:999px;width:3px;height:46px;transition:opacity .14s,background-color .14s,border-color .14s;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)}._7tcgUG_resizer:hover:after,._7tcgUG_resizer:focus-visible:after,._7tcgUG_group[data-resizing] ._7tcgUG_resizer:after{opacity:1}._7tcgUG_resizer:hover:after,._7tcgUG_resizer:focus-visible:after{border-color:var(--dsw-alias-border-l3);background:var(--dsw-alias-interactive-bg-hover)}._7tcgUG_resizer:focus-visible{outline:none}._7tcgUG_group[data-resizing] iframe{pointer-events:none;user-select:none}._7tcgUG_close{z-index:2;border:1px solid var(--dsw-alias-border-l2);width:28px;height:28px;color:var(--dsw-alias-label-secondary);background:color-mix(in srgb, var(--dsw-alias-bg-base) 92%, transparent);cursor:pointer;backdrop-filter:blur(8px);border-radius:50%;place-items:center;padding:0;display:grid;position:absolute;top:10px;right:10px;box-shadow:0 2px 8px #0000000f}._7tcgUG_close:hover{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-interactive-bg-hover)}._7tcgUG_close:focus-visible{outline:2px solid var(--dsw-alias-state-business-primary);outline-offset:2px}@media (prefers-reduced-motion:reduce){._7tcgUG_resizer:after{transition:none}}";
		const tagId = "@deepseek-ai/dsh-client-ui-multi-window/SplitPaneWorkspace.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@deepseek-ai/dsh-client-ui-multi-window";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		var SplitPaneWorkspace_module_css_default = {
			"close": "_7tcgUG_close",
			"dropIcon": "_7tcgUG_dropIcon",
			"dropOverlay": "_7tcgUG_dropOverlay",
			"frame": "_7tcgUG_frame",
			"group": "_7tcgUG_group",
			"pane": "_7tcgUG_pane",
			"resizer": "_7tcgUG_resizer"
		};
		//#endregion
		//#region src/client/window-contract.ts
		/** Query marker carried only by windows created by this plugin. */
		const DSH_WINDOW_ROLE_PARAM = "dsh-window";
		/** Stable identity that isolates navigation and persisted window state. */
		const DSH_WINDOW_ID_PARAM = "dsh-window-id";
		/** Session selected when an auxiliary window first opens. */
		const DSH_WINDOW_SESSION_PARAM = "dsh-session";
		/** Presentation marker for an auxiliary document embedded as a pane. */
		const DSH_WINDOW_EMBED_PARAM = "dsh-embed";
		/** Drag payload shared with native Session rows. */
		const SESSION_DRAG_MIME = "application/x-dsh-session-id";
		const AUXILIARY_ROLE = "auxiliary";
		const CONVERSATION_PANE_EMBED = "conversation-pane";
		/** Parse the URL-owned identity used by this plugin's auxiliary documents. */
		function parseDshWindowContext(search) {
			const params = new URLSearchParams(search);
			const windowId = params.get(DSH_WINDOW_ID_PARAM)?.trim();
			if (params.get("dsh-window") !== AUXILIARY_ROLE || windowId === void 0 || windowId === "") return { role: "primary" };
			const sessionId = params.get(DSH_WINDOW_SESSION_PARAM)?.trim();
			return {
				role: "auxiliary",
				windowId,
				...sessionId === void 0 || sessionId === "" ? {} : { sessionId },
				...params.get("dsh-embed") === CONVERSATION_PANE_EMBED ? { embedded: true } : {}
			};
		}
		/** Current window identity; non-browser runtimes are primary. */
		function currentDshWindowContext() {
			return typeof location === "undefined" ? { role: "primary" } : parseDshWindowContext(location.search);
		}
		/** Build the isolated same-origin document used by one conversation pane. */
		function embeddedDshPaneUrl(currentUrl, paneId, sessionId) {
			const url = new URL(currentUrl);
			url.searchParams.set(DSH_WINDOW_ROLE_PARAM, AUXILIARY_ROLE);
			url.searchParams.set(DSH_WINDOW_ID_PARAM, paneId);
			url.searchParams.set(DSH_WINDOW_SESSION_PARAM, sessionId);
			url.searchParams.set(DSH_WINDOW_EMBED_PARAM, CONVERSATION_PANE_EMBED);
			return url.toString();
		}
		//#endregion
		//#region src/client/SplitPaneWorkspace.tsx
		const PRIMARY_PANE_ID = "primary";
		const PANE_LAYOUT_STORAGE_KEY = "dsh.multi-pane.layout.v1";
		const MIN_PANE_WIDTH = 180;
		const KEYBOARD_RESIZE_STEP = 24;
		function equalRatios(count) {
			return Array.from({ length: count }, () => 1 / count);
		}
		function validRatios(value, count) {
			return Array.isArray(value) && value.length === count && value.every((item) => typeof item === "number" && Number.isFinite(item) && item > 0);
		}
		function readPaneLayout(ids) {
			try {
				const value = JSON.parse(localStorage.getItem(PANE_LAYOUT_STORAGE_KEY) ?? "null");
				if (typeof value !== "object" || value === null) return equalRatios(ids.length);
				const storedIds = Reflect.get(value, "ids");
				const storedRatios = Reflect.get(value, "ratios");
				if (!Array.isArray(storedIds) || storedIds.length !== ids.length || storedIds.some((id, index) => id !== ids[index]) || !validRatios(storedRatios, ids.length)) return equalRatios(ids.length);
				const sum = storedRatios.reduce((total, ratio) => total + ratio, 0);
				return storedRatios.map((ratio) => ratio / sum);
			} catch {
				return equalRatios(ids.length);
			}
		}
		function storePaneLayout(ids, ratios) {
			try {
				const value = {
					ids,
					ratios
				};
				localStorage.setItem(PANE_LAYOUT_STORAGE_KEY, JSON.stringify(value));
			} catch {}
		}
		function paneWorkspaceWidth(group) {
			let ancestor = group?.parentElement ?? null;
			while (ancestor !== null) {
				const width = ancestor.getBoundingClientRect().width;
				if (width > 0) return width;
				ancestor = ancestor.parentElement;
			}
			return group?.getBoundingClientRect().width ?? 0;
		}
		/** Resolve the assembled conversation frame across the renderer's slot wrapper. */
		function conversationDropSurface(group) {
			const immediate = group?.parentElement ?? null;
			let ancestor = immediate;
			while (ancestor !== null) {
				if (ancestor.querySelector("[data-conversation-scroll]") !== null) return ancestor;
				ancestor = ancestor.parentElement;
			}
			return immediate;
		}
		/** Resize only the panes touching one separator, preserving every other pane. */
		function resizeAdjacentPanes(ratios, boundary, deltaPx, totalWidth) {
			if (boundary < 0 || boundary >= ratios.length - 1 || totalWidth <= 0) return ratios;
			const minimumRatio = Math.min(MIN_PANE_WIDTH, Math.max(120, totalWidth / ratios.length * .6)) / totalWidth;
			const pairTotal = (ratios[boundary] ?? 0) + (ratios[boundary + 1] ?? 0);
			const left = Math.min(pairTotal - minimumRatio, Math.max(minimumRatio, (ratios[boundary] ?? 0) + deltaPx / totalWidth));
			if (!Number.isFinite(left) || left <= 0 || pairTotal - left <= 0) return ratios;
			const next = [...ratios];
			next[boundary] = left;
			next[boundary + 1] = pairTotal - left;
			return next;
		}
		function PaneResizeHandle(props) {
			const origin = (0, react.useRef)(0);
			const latest = (0, react.useRef)(0);
			const startRatios = (0, react.useRef)(props.ratios);
			const frame = (0, react.useRef)(null);
			const callbacks = (0, react.useRef)(props);
			callbacks.current = props;
			(0, react.useEffect)(() => () => {
				if (frame.current !== null) cancelAnimationFrame(frame.current);
			}, []);
			const resizeAt = (0, react.useCallback)((clientX) => {
				callbacks.current.onResize(resizeAdjacentPanes(startRatios.current, callbacks.current.boundary, clientX - origin.current, callbacks.current.workspaceWidth()));
			}, []);
			const finishPointer = (0, react.useCallback)((event) => {
				if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
				event.currentTarget.releasePointerCapture(event.pointerId);
				if (frame.current !== null) {
					cancelAnimationFrame(frame.current);
					frame.current = null;
				}
				resizeAt(latest.current);
				callbacks.current.onDraggingChange(false);
				callbacks.current.onCommit();
			}, [resizeAt]);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: SplitPaneWorkspace_module_css_default.resizer,
				style: { left: props.left },
				role: "separator",
				tabIndex: 0,
				"aria-orientation": "vertical",
				"aria-label": props.label,
				"aria-valuemin": 0,
				"aria-valuemax": 100,
				"aria-valuenow": props.valueNow,
				"data-pane-boundary": props.boundary,
				onDoubleClick: (event) => {
					event.preventDefault();
					props.onReset();
				},
				onKeyDown: (event) => {
					if (event.key === "Enter") {
						event.preventDefault();
						props.onReset();
						return;
					}
					if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
					event.preventDefault();
					const delta = event.key === "ArrowLeft" ? -24 : KEYBOARD_RESIZE_STEP;
					props.onResize(resizeAdjacentPanes(props.ratios, props.boundary, delta, props.workspaceWidth()));
					queueMicrotask(props.onCommit);
				},
				onPointerDown: (event) => {
					event.preventDefault();
					event.currentTarget.setPointerCapture(event.pointerId);
					origin.current = event.clientX;
					latest.current = event.clientX;
					startRatios.current = props.ratios;
					props.onDraggingChange(true);
				},
				onPointerMove: (event) => {
					if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
					latest.current = event.clientX;
					frame.current ??= requestAnimationFrame(() => {
						frame.current = null;
						resizeAt(latest.current);
					});
				},
				onPointerUp: finishPointer,
				onPointerCancel: finishPointer
			});
		}
		function DropSplitIcon() {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
				className: SplitPaneWorkspace_module_css_default.dropIcon,
				viewBox: "0 0 20 20",
				"aria-hidden": "true",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("rect", {
						x: "2.75",
						y: "3.25",
						width: "14.5",
						height: "13.5",
						rx: "2.25"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M10 3.5v13" }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "m12.75 8 2 2-2 2" })
				]
			});
		}
		/** Secondary full conversation documents sharing the primary page's workspace. */
		function SplitPaneWorkspace({ useSessions, coordinator, t }) {
			const snapshot = (0, react.useSyncExternalStore)(coordinator.subscribe, coordinator.getSnapshot, coordinator.getSnapshot);
			const titles = useSessions((s) => s.byId);
			const currentSessionId = snapshot.currentSessionId;
			const groupRef = (0, react.useRef)(null);
			const [dropActive, setDropActive] = (0, react.useState)(false);
			const paneIds = (0, react.useMemo)(() => [PRIMARY_PANE_ID, ...snapshot.panes.map((pane) => pane.paneId)], [snapshot.panes]);
			const paneKey = paneIds.join("|");
			const [ratios, setRatios] = (0, react.useState)(() => readPaneLayout(paneIds));
			const [dragging, setDragging] = (0, react.useState)(false);
			const ratiosRef = (0, react.useRef)(ratios);
			const currentRatios = ratios.length === paneIds.length ? ratios : equalRatios(paneIds.length);
			ratiosRef.current = currentRatios;
			(0, react.useEffect)(() => {
				const next = readPaneLayout(paneIds);
				ratiosRef.current = next;
				setRatios(next);
			}, [paneKey]);
			(0, react.useEffect)(() => {
				const ownerDocument = groupRef.current?.ownerDocument;
				if (ownerDocument === void 0) return;
				const compatible = (event) => Array.from(event.dataTransfer?.types ?? []).includes(SESSION_DRAG_MIME);
				const surfaceFor = (event) => {
					const frame = conversationDropSurface(groupRef.current);
					const target = event.target;
					return frame !== null && target instanceof Node && frame.contains(target) ? frame : null;
				};
				const activate = (event) => {
					if (!compatible(event) || surfaceFor(event) === null) return;
					event.preventDefault();
					event.stopPropagation();
					if (event.dataTransfer !== null) event.dataTransfer.dropEffect = snapshot.atLimit ? "none" : "copy";
					setDropActive(true);
				};
				const leave = (event) => {
					const frame = surfaceFor(event);
					if (frame === null) return;
					const related = event.relatedTarget;
					if (related instanceof Node && frame.contains(related)) return;
					setDropActive(false);
				};
				const drop = (event) => {
					if (!compatible(event) || surfaceFor(event) === null) return;
					event.preventDefault();
					event.stopPropagation();
					setDropActive(false);
					const transfer = event.dataTransfer;
					if (transfer === null || snapshot.atLimit) return;
					const raw = transfer.getData(SESSION_DRAG_MIME);
					if (raw === "" || !Object.hasOwn(titles, raw)) return;
					if (coordinator.openSession(raw) !== "limit") transfer.dropEffect = "copy";
				};
				const clear = () => {
					setDropActive(false);
				};
				ownerDocument.addEventListener("dragenter", activate);
				ownerDocument.addEventListener("dragover", activate);
				ownerDocument.addEventListener("dragleave", leave);
				ownerDocument.addEventListener("drop", drop);
				window.addEventListener("dragend", clear);
				return () => {
					ownerDocument.removeEventListener("dragenter", activate);
					ownerDocument.removeEventListener("dragover", activate);
					ownerDocument.removeEventListener("dragleave", leave);
					ownerDocument.removeEventListener("drop", drop);
					window.removeEventListener("dragend", clear);
				};
			}, [
				coordinator,
				snapshot.atLimit,
				titles
			]);
			const workspaceWidth = (0, react.useCallback)(() => paneWorkspaceWidth(groupRef.current), []);
			const updateRatios = (0, react.useCallback)((next) => {
				ratiosRef.current = next;
				setRatios(next);
			}, []);
			const commitRatios = (0, react.useCallback)(() => {
				storePaneLayout(paneIds, ratiosRef.current);
			}, [paneKey]);
			const resetRatios = (0, react.useCallback)(() => {
				const next = equalRatios(paneIds.length);
				updateRatios(next);
				storePaneLayout(paneIds, next);
			}, [paneKey, updateRatios]);
			const paneTitles = [currentSessionId === void 0 ? t("pane.untitled") : titles[currentSessionId]?.displayTitle ?? t("pane.untitled"), ...snapshot.panes.map((pane) => titles[pane.sessionId]?.displayTitle ?? t("pane.untitled"))];
			const secondaryShare = currentRatios.slice(1).reduce((sum, ratio) => sum + ratio, 0);
			const secondaryColumns = currentRatios.slice(1).map((ratio) => `${ratio / secondaryShare}fr`).join(" ");
			const handles = Array.from({ length: currentRatios.length - 1 }, (_, boundary) => {
				const groupPosition = boundary === 0 ? 0 : currentRatios.slice(1, boundary + 1).reduce((sum, ratio) => sum + ratio, 0) / secondaryShare;
				const cumulative = currentRatios.slice(0, boundary + 1).reduce((sum, ratio) => sum + ratio, 0);
				return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(PaneResizeHandle, {
					boundary,
					left: `${groupPosition * 100}%`,
					valueNow: Math.round(cumulative * 100),
					label: t("pane.resize", {
						left: paneTitles[boundary] ?? t("pane.untitled"),
						right: paneTitles[boundary + 1] ?? t("pane.untitled")
					}),
					ratios: currentRatios,
					workspaceWidth,
					onResize: updateRatios,
					onCommit: commitRatios,
					onReset: resetRatios,
					onDraggingChange: setDragging
				}, `boundary-${boundary}`);
			});
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				ref: groupRef,
				className: SplitPaneWorkspace_module_css_default.group,
				"data-auxiliary-pane-group": "",
				"data-resizing": dragging || void 0,
				"data-empty": snapshot.panes.length === 0 || void 0,
				"data-drop-active": dropActive || void 0,
				style: {
					"--dsh-secondary-pane-count": snapshot.panes.length,
					flexBasis: `${secondaryShare * 100}%`,
					gridTemplateColumns: secondaryColumns
				},
				children: [
					dropActive && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: SplitPaneWorkspace_module_css_default.dropOverlay,
						role: "status",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(DropSplitIcon, {}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t(snapshot.atLimit ? "drop.limit" : "drop.open") })]
					}),
					snapshot.panes.map((pane, index) => {
						const title = paneTitles[index + 1] ?? t("pane.untitled");
						return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
							className: SplitPaneWorkspace_module_css_default.pane,
							"aria-label": title,
							"data-pane-id": pane.paneId,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("iframe", {
								className: SplitPaneWorkspace_module_css_default.frame,
								src: embeddedDshPaneUrl(location.href, pane.paneId, pane.sessionId),
								title,
								loading: "eager",
								allow: "clipboard-read; clipboard-write"
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: SplitPaneWorkspace_module_css_default.close,
								"aria-label": t("pane.close", { title }),
								onClick: () => {
									coordinator.closePane(pane.paneId);
								},
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCloseOutlineRegular, { size: 14 })
							})]
						}, pane.paneId);
					}),
					handles
				]
			});
		}
		//#endregion
		//#region src/client/WindowMenuAction.tsx
		function SplitPaneIcon() {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
				width: "16",
				height: "16",
				viewBox: "0 0 16 16",
				fill: "none",
				"aria-hidden": "true",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("rect", {
					x: "1.75",
					y: "2.25",
					width: "5.25",
					height: "11.5",
					rx: "1.5",
					stroke: "currentColor",
					strokeWidth: "1.5"
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("rect", {
					x: "9",
					y: "2.25",
					width: "5.25",
					height: "11.5",
					rx: "1.5",
					stroke: "currentColor",
					strokeWidth: "1.5"
				})]
			});
		}
		/** Native-looking action that adds one conversation block to the current page. */
		function WindowMenuAction({ sessionId, closeMenu, useMenuOpenState, coordinator, t }) {
			const setMenuOpen = useMenuOpenState?.()[1];
			const snapshot = (0, react.useSyncExternalStore)(coordinator.subscribe, coordinator.getSnapshot, coordinator.getSnapshot);
			const visible = snapshot.currentSessionId === sessionId || snapshot.panes.some((pane) => pane.sessionId === sessionId);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.MenuItemButton, {
				icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SplitPaneIcon, {}),
				disabled: visible || snapshot.atLimit,
				onSelect: () => {
					if (coordinator.openSession(sessionId) === "opened") {
						setMenuOpen?.(false);
						closeMenu?.();
					}
				},
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					title: snapshot.atLimit ? t("action.limit") : void 0,
					children: visible ? t("action.visible") : t("action.open")
				})
			});
		}
		//#endregion
		//#region src/client/locales.ts
		const NS = "multiWindow";
		const zh = {
			"action.open": "并排打开",
			"action.visible": "已在当前页面",
			"action.limit": "当前页面最多并排 4 个对话",
			"pane.close": "关闭“{title}”",
			"pane.resize": "调整“{left}”与“{right}”的宽度；双击恢复均分",
			"pane.untitled": "未命名对话",
			"drop.open": "松开以并排打开",
			"drop.limit": "当前页面已满，关闭一个分块后再拖入"
		};
		const en = {
			"action.open": "Open Side by Side",
			"action.visible": "Already on This Page",
			"action.limit": "Up to 4 conversations can share this page",
			"pane.close": "Close “{title}”",
			"pane.resize": "Resize “{left}” and “{right}”; double-click to distribute evenly",
			"pane.untitled": "Untitled conversation",
			"drop.open": "Drop to open side by side",
			"drop.limit": "This page is full. Close a pane before adding another"
		};
		//#endregion
		//#region src/client/index.ts
		const inject = [
			"sessions",
			"uiSession",
			"uiWorkspace",
			"slots",
			"locale"
		];
		const OPEN_PANE_MESSAGE = "dsh:multi-pane-open";
		const CAN_OPEN_PANE_MESSAGE = "dsh:multi-pane-can-open";
		const OPEN_PANE_REQUEST = "dsh:multi-pane-open-request";
		const PANE_RESPONSE = "dsh:multi-pane-response";
		const PARENT_RESPONSE_TIMEOUT_MS = 2e3;
		function requestParent(type, sessionId, fallback, timeoutMs) {
			const requestId = `${Date.now()}-${Math.random()}`;
			return new Promise((resolve) => {
				const finish = (value) => {
					window.clearTimeout(timeout);
					window.removeEventListener("message", receive);
					resolve(value);
				};
				const receive = (event) => {
					if (event.source !== window.parent || event.origin !== location.origin || typeof event.data !== "object" || event.data === null || Reflect.get(event.data, "type") !== PANE_RESPONSE || Reflect.get(event.data, "requestId") !== requestId) return;
					finish(Reflect.get(event.data, "result"));
				};
				const timeout = window.setTimeout(() => {
					finish(fallback);
				}, timeoutMs);
				window.addEventListener("message", receive);
				window.parent.postMessage({
					type,
					requestId,
					...sessionId === void 0 ? {} : { sessionId }
				}, location.origin);
			});
		}
		/** Ask the primary page whether an auxiliary selection may open another pane. */
		function requestParentCanOpen(sessionId, timeoutMs = PARENT_RESPONSE_TIMEOUT_MS) {
			return requestParent(CAN_OPEN_PANE_MESSAGE, sessionId, false, timeoutMs);
		}
		function requestParentOpen(sessionId, timeoutMs = PARENT_RESPONSE_TIMEOUT_MS) {
			return requestParent(OPEN_PANE_REQUEST, sessionId, "limit", timeoutMs);
		}
		function installAuxiliaryNavigation(ctx) {
			const target = currentDshWindowContext().sessionId;
			let initialTargetOpened = target === void 0;
			const synchronize = () => {
				const snapshot = ctx.sessions.list.getSnapshot();
				if (!initialTargetOpened && target !== void 0 && snapshot.byId[target] !== void 0) {
					initialTargetOpened = true;
					ctx.uiWorkspace.openSession(target);
					return;
				}
				const current = ctx.uiSession.adapter.current.getSnapshot().key;
				if (current === void 0) return;
				const url = new URL(location.href);
				if (url.searchParams.get("dsh-session") !== current) {
					url.searchParams.set(DSH_WINDOW_SESSION_PARAM, current);
					history.replaceState(history.state, "", url);
				}
				const title = snapshot.byId[current]?.displayTitle;
				if (title !== void 0 && title !== "") document.title = `${title} · DeepSeek Harness`;
			};
			synchronize();
			ctx.effect(() => ctx.sessions.list.subscribe(synchronize), "ui-multi-window: pane navigation");
			ctx.effect(() => ctx.uiSession.adapter.current.subscribe(synchronize), "ui-multi-window: main view navigation");
		}
		/** Register in-page conversation splitting and compact auxiliary pane boot. */
		function apply(ctx) {
			ctx.effect(() => ctx.locale.register(NS, {
				zh,
				en
			}), "ui-multi-window: dictionaries");
			if (currentDshWindowContext().role === "auxiliary") {
				ctx.provide("multiPane", {
					canOpenSession: (sessionId) => requestParentCanOpen(sessionId),
					openSession: (sessionId) => requestParentOpen(sessionId)
				});
				ctx.provide("auxiliaryPane", ctx.multiPane);
				installAuxiliaryNavigation(ctx);
				return;
			}
			const coordinator = new MultiPaneCoordinator();
			ctx.provide("multiPane", coordinator);
			ctx.provide("auxiliaryPane", coordinator);
			const synchronize = () => {
				const snapshot = ctx.sessions.list.getSnapshot();
				if (snapshot.phase !== "ready") return;
				coordinator.sync(ctx.uiSession.adapter.current.getSnapshot().key, new Set(Object.keys(snapshot.byId)));
			};
			synchronize();
			ctx.effect(() => coordinator.start(), "ui-multi-window: in-page pane coordinator");
			ctx.effect(() => {
				const receive = (event) => {
					if (event.origin !== location.origin || typeof event.data !== "object" || event.data === null) return;
					const type = Reflect.get(event.data, "type");
					const requestId = Reflect.get(event.data, "requestId");
					const sessionId = Reflect.get(event.data, "sessionId");
					if (type === OPEN_PANE_MESSAGE) {
						if (typeof sessionId === "string" && sessionId !== "") coordinator.openSession(sessionId);
						return;
					}
					if (type !== CAN_OPEN_PANE_MESSAGE && type !== OPEN_PANE_REQUEST || typeof requestId !== "string" || event.source === null) return;
					const candidate = typeof sessionId === "string" && sessionId !== "" ? sessionId : void 0;
					const result = type === CAN_OPEN_PANE_MESSAGE ? coordinator.canOpenSession(candidate) : candidate === void 0 ? "limit" : coordinator.openSession(candidate);
					event.source.postMessage({
						type: PANE_RESPONSE,
						requestId,
						result
					}, event.origin);
				};
				window.addEventListener("message", receive);
				return () => {
					window.removeEventListener("message", receive);
				};
			}, "ui-multi-window: embedded-pane open requests");
			ctx.effect(() => ctx.sessions.list.subscribe(synchronize), "ui-multi-window: session reconciliation");
			ctx.effect(() => ctx.uiSession.adapter.current.subscribe(synchronize), "ui-multi-window: main view reconciliation");
			ctx.slots.inject("sidebar.workspaces.session.menu.item", () => ctx.slots.register({
				name: "sidebar.workspaces.session.menu.item",
				id: "open-side-by-side",
				order: 10,
				locale: NS,
				inject: () => ({ coordinator })
			}, WindowMenuAction));
			ctx.slots.inject("main.conversation", () => {
				let active = true;
				const listeners = /* @__PURE__ */ new Set();
				const subscribe = (listener) => {
					listeners.add(listener);
					return () => {
						listeners.delete(listener);
					};
				};
				const isActive = () => active;
				const wrapped = /* @__PURE__ */ new WeakSet();
				const restores = [];
				const wrap = () => {
					for (const entry of ctx.slots.entries("main.conversation")) {
						const original = entry.component;
						if (wrapped.has(original)) continue;
						const withPanes = (props) => {
							if (!(0, react.useSyncExternalStore)(subscribe, isActive, isActive)) return (0, react.createElement)(original, props);
							return (0, react.createElement)("div", {
								style: {
									display: "flex",
									position: "relative",
									flex: "1 1 auto",
									minWidth: 0,
									minHeight: 0,
									height: "100%"
								},
								"data-dsh-split-workspace": ""
							}, (0, react.createElement)("div", { style: {
								display: "flex",
								flexDirection: "column",
								flex: "1 1 0",
								minWidth: 0,
								minHeight: 0
							} }, (0, react.createElement)(original, props)), (0, react.createElement)(SplitPaneWorkspace, {
								useSessions: props.useSessions,
								coordinator,
								t: ctx.locale.bind(NS)
							}));
						};
						wrapped.add(withPanes);
						entry.component = withPanes;
						restores.push(() => {
							if (entry.component === withPanes) entry.component = original;
						});
					}
				};
				wrap();
				const off = ctx.on("slots/changed", (key) => {
					if (key === "main.conversation") wrap();
				});
				return () => {
					off();
					active = false;
					for (const listener of listeners) listener();
					for (const restore of restores) restore();
				};
			});
		}
		//#endregion
		exports.MAX_DSH_PANES = MAX_DSH_PANES;
		exports.MAX_DSH_WINDOWS = MAX_DSH_WINDOWS;
		exports.MultiPaneCoordinator = MultiPaneCoordinator;
		exports.MultiWindowCoordinator = MultiWindowCoordinator;
		exports.SplitPaneWorkspace = SplitPaneWorkspace;
		exports.WindowMenuAction = WindowMenuAction;
		exports.apply = apply;
		exports.inject = inject;
		exports.requestParentCanOpen = requestParentCanOpen;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map