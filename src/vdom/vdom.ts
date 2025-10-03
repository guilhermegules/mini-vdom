import { createDom } from "../dom";
import type { ComponentInstance } from "../types/component-instance.type";
import type { VNode } from "../types/vnode.type";
import { diff } from "../diff";
import { componentFactory } from "@/factory/component-factory";

export let currentComponent: ComponentInstance;

export let hook = {
  index: 0,
  states: new WeakMap<ComponentInstance, any[]>(),
};

const componentInstances = new WeakMap<HTMLElement, ComponentInstance>();
const previousVNodes = new WeakMap<HTMLElement, VNode | string>();

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
    instance = componentFactory(componentFn, container);
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

  previousVNodes.set(container, resolvedVNode);
}

function resolveVNode(vnode: VNode | string): VNode | string {
  if (typeof vnode === "string") {
    return vnode;
  }

  if (typeof vnode.type === "function") {
    const instance = componentFactory(() =>
      (vnode.type as Function)(vnode.props || {})
    );
    resetHooks(instance);
    const component = instance.fn();
    return resolveVNode(component);
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

function normalizeChildren(children: any[]) {
  if (!children) return [];

  if (Array.isArray(children)) {
    if (children.every((c) => typeof c === "string")) {
      return children.flat().join("").split(" ");
    }

    return children.flat().filter(Boolean);
  }

  return [children];
}
