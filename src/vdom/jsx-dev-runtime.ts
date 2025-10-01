import { createElement } from "@vdom";

export function jsxDEV(
  type: any,
  props: any,
  key?: any,
  isStaticChildren?: boolean
) {
  return createElement(type, props ?? null, ...(props.children ?? []));
}
