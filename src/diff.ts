import { createDom } from "./dom";
import type { VNode } from "./types/vnode.type";

export function diff(
  oldVNode: VNode | string,
  newVNode: VNode | string,
  container: HTMLElement,
  index = 0
) {
  const childNodes = container.childNodes;
  const oldNode = childNodes[index];

  oldVNode &&= resolveVNode(oldVNode);
  newVNode &&= resolveVNode(newVNode);

  // If oldVNode doesn't exist, add newVNode
  if (!oldVNode) {
    container.appendChild(createDom(newVNode));
    return;
  }

  // If newVNode doesn't exist, remove oldVNode
  if (!newVNode && oldNode) {
    container.removeChild(oldNode);
    return;
  }

  // If both are strings (text nodes) and different, update text
  if (
    typeof oldVNode === "string" &&
    typeof newVNode === "string" &&
    oldVNode !== newVNode &&
    oldNode
  ) {
    oldNode.textContent = newVNode;
    return;
  }

  // If types are different, replace node
  if (
    typeof oldVNode !== "string" &&
    typeof newVNode !== "string" &&
    oldVNode.type !== newVNode.type &&
    oldNode
  ) {
    container.replaceChild(createDom(newVNode), oldNode);
    return;
  }

  // Both are element nodes of the same type update props and recurse on children
  if (typeof oldVNode !== "string" && typeof newVNode !== "string") {
    updateProps(oldNode as HTMLElement, oldVNode.props, newVNode.props);

    const oldChildren = normalizeVNodeChildren(oldVNode.props.children);
    const newChildren = normalizeVNodeChildren(newVNode.props.children);

    if (oldChildren.length === 1 && newChildren.length === 1) {
      const [oldChild] = oldChildren;
      const [newChild] = newChildren;
      if (
        typeof oldChild === "string" &&
        typeof newChild === "string" &&
        oldChild !== newChild &&
        oldNode
      ) {
        oldNode.textContent = newChild;
        return;
      }
    }

    const maxLen = Math.max(oldChildren.length, newChildren.length);

    for (let i = 0; i < maxLen; i++) {
      const oldChildrenItem = oldChildren[i]!;
      const newChildrenItem = newChildren[i]!;
      diff(oldChildrenItem, newChildrenItem, oldNode as HTMLElement, i);
    }
  }
}

function updateProps(
  dom: HTMLElement,
  oldProps: Record<string, any>,
  newProps: Record<string, any>
) {
  oldProps = oldProps || {};
  newProps = newProps || {};

  for (const key in oldProps) {
    if (key === "children") continue;

    if (!(key in newProps) && key in dom) {
      // @ts-expect-error dynamic assignment, but safe with check above
      dom[key] = undefined;
    }
  }

  for (const [key, value] of Object.entries(newProps)) {
    if (key === "children") continue;

    if (key === "ref" && typeof value === "function") {
      value(dom);
    }

    if (oldProps[key] !== newProps[key] && key in dom) {
      // @ts-expect-error dynamic assignment, but safe with check above
      dom[key] = newProps[key];
    }
  }
}

function normalizeVNodeChildren(
  children: (VNode | string)[] | string | undefined
) {
  if (!children) return [];

  return children;
}

function resolveVNode(vnode: VNode | string): VNode | string {
  if (typeof vnode === "string") {
    return vnode;
  }

  if (typeof vnode.type === "function") {
    return resolveVNode(vnode.type(vnode.props));
  }

  return vnode;
}
