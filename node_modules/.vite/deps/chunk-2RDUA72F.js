// node_modules/@radix-ui/primitive/dist/index.mjs
var canUseDOM = !!(typeof window !== "undefined" && window.document && window.document.createElement);
function composeEventHandlers(originalEventHandler, ourEventHandler, { checkForDefaultPrevented = true } = {}) {
  return function handleEvent(event) {
    originalEventHandler == null ? void 0 : originalEventHandler(event);
    if (checkForDefaultPrevented === false || !event.defaultPrevented) {
      return ourEventHandler == null ? void 0 : ourEventHandler(event);
    }
  };
}

export {
  composeEventHandlers
};
//# sourceMappingURL=chunk-2RDUA72F.js.map
