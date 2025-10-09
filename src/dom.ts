import type { VNode } from "./types/vnode.type";

export function createDom(vnode: VNode | string): Node {
  if (typeof vnode === "string") {
    return document.createTextNode(vnode);
  }

  if (typeof vnode.type === "function") {
    const componentVNode = vnode.type(vnode.props || {});
    return createDom(componentVNode);
  }

  const dom = document.createElement(vnode.type as string);

  for (const [key, value] of Object.entries(vnode.props || {})) {
    if (key === "children") continue;

    if (key.startsWith("on") && typeof value === "function") {
      const eventName = key.slice(2).toLowerCase();
      dom.addEventListener(eventName, value);
    } else {
      // @ts-ignore
      dom[key] = value;
    }
  }

  for (const child of vnode.props.children || []) {
    dom.appendChild(createDom(child));
  }

  return dom;
}
