import type { Effect } from "./effect.type";
import type { VNode } from "./vnode.type";

export type ComponentInstance = {
  effects: Effect[];
  fn: () => VNode;
  container: HTMLElement;
};
