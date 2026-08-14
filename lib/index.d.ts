//#region src/index.d.ts
/** Host loader entry for the browser-only theme plugin. */
declare const inject: readonly [];
/** All behavior lives in the client face; no Host settings namespace is needed. */
declare function apply(): void;
//#endregion
export { apply, inject };