namespace JSX {
  export type Element = import("./vnode.type").VNode;
  export interface IntrinsicElements {
    [tag: string]: any;
  }
}
