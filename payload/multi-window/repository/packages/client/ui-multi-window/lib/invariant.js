//#region lib/types/invariant.js
const PACKAGE_NAME = "@deepseek-ai/dsh-client-ui-multi-window";
const name = "client-ui-multi-window-invariant";
const inject = ["invariants"];
/** No runtime invariant: pane ownership and request routing are covered by coordinator tests. */
const install = () => {};
const apply = (ctx) => Promise.resolve(ctx.invariants.register(PACKAGE_NAME, install));
//#endregion
export { apply, inject, name };
