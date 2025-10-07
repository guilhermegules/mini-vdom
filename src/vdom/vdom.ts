import { diff } from "@/diff";
import { createDom } from "@/dom";
import { componentFactory } from "@/factory/component-factory";
import type { ComponentInstance } from "@/types/component-instance.type";
import type { VNode } from "@/types/vnode.type";

export let currentComponent: ComponentInstance;

export let hook = {
  index: 0,
  states: [] as any,
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
  if (typeof vnode.type === "function") {
    currentComponent = componentFactory(
      () => (vnode.type as Function)(vnode.props || {}),
      container
    );
    renderComponent(currentComponent.fn, container);
    return;
  }

  appendVNode(vnode, container);

  previousVNodes.set(container, vnode);
}

function appendVNode(vnode: VNode, container: HTMLElement) {
  const previousVNode = previousVNodes.get(container);

  if (previousVNode) {
    diff(previousVNode, vnode, container);
    return;
  }

  container.appendChild(createDom(vnode));
}

function normalizeChildren(children: any[]) {
  if (!children) return [];

  if (Array.isArray(children)) {
    if (children.every((c) => typeof c === "string")) {
      return children.flat().join("");
    }

    return children.flat().filter(Boolean);
  }

  return [children];
}
