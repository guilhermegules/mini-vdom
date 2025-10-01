import { createDom } from "../dom";
import type { ComponentInstance } from "../types/component-instance.type";
import type { VNode } from "../types/vnode.type";
import { diff } from "../diff";

export let currentComponent: ComponentInstance;

export let hook = {
  index: 0,
  states: new WeakMap<ComponentInstance, any[]>(),
};

const componentInstances = new WeakMap<HTMLElement, ComponentInstance>();
const previousVNodes = new WeakMap<HTMLElement, VNode>();

export function resetHooks(componentInstance: ComponentInstance) {
  currentComponent = componentInstance;
  hook.index = 0;
}

export function createElement(
  type: string | Function,
  props: { [key: string]: any } | null = {},
  ...children: any[]
): VNode {
  return {
    type,
    props: {
      ...props,
      children: normalizeChildren(children),
    },
  };
}

export function renderComponent(
  componentFn: () => VNode,
  container: HTMLElement
): void {
  let instance = componentInstances.get(container);

  if (!instance) {
    instance = { hooks: [], effects: [], fn: componentFn, container };
    componentInstances.set(container, instance);
  }

  resetHooks(instance);

  const vnode = componentFn();
  render(vnode, container);

  instance.effects.forEach((effect) => {
    const changed =
      !effect.deps ||
      effect.deps.some((dep, i) => dep !== effect.prevDeps?.[i]);

    if (changed) {
      if (effect.cleanup) {
        effect.cleanup();
      }

      const cleanup = effect.callback();
      effect.cleanup = typeof cleanup === "function" ? cleanup : undefined;
      effect.prevDeps = effect.deps;
    }
  });
}

export function render(vnode: VNode, container: HTMLElement): void {
  const resolvedVNode = resolveVNode(vnode);

  appendVNode(resolvedVNode, container);

  previousVNodes.set(container, vnode);
}

function resolveVNode(vnode: VNode | string): VNode | string {
  if (typeof vnode === "string") {
    return vnode;
  }

  if (typeof vnode.type === "function") {
    const componentFn = vnode.type(vnode.props || {});
    return resolveVNode(componentFn);
  }

  const children = vnode.props?.children ?? [];
  const normalizedChildren = Array.isArray(children) ? children : [children];

  return {
    ...vnode,
    props: {
      ...vnode.props,
      children: normalizedChildren.map(resolveVNode),
    },
  };
}

function appendVNode(vnode: VNode | string, container: HTMLElement) {
  const previousVNode = previousVNodes.get(container);

  if (previousVNode) {
    diff(previousVNode, vnode, container);
    return;
  }

  const dom = createDom(vnode);
  container.appendChild(dom);
}

function normalizeChildren(...children: any[]) {
  return Array.isArray(children)
    ? children.flat().filter((child) => child !== false && child != null)
    : [];
}
