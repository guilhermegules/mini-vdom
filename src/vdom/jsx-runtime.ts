import { createElement } from "@vdom";

export function jsx(type: any, props: any, key?: any) {
  return createElement(type, props ?? null, ...(props.children ?? []));
}

export function jsxs(type: any, props: any, key?: any) {
  return createElement(type, props ?? null, ...(props.children ?? []));
}
