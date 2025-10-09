import type { VNode } from "@/types/vnode.type";

export function componentFactory(vnode: () => VNode, container?: HTMLElement) {
  return {
    effects: [],
    fn: vnode,
    container: container ?? document.createElement("div"),
  };
}
