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

function normalizeChildren(...children: any[]) {
  return children.flat().filter((child) => child !== false && child != null);
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
  if (typeof vnode.type === "function") {
    currentComponent = {
      ...currentComponent,
      fn: () => (vnode.type as Function)(vnode.props || {}),
      container,
    };
    renderComponent(currentComponent.fn, container);
    return;
  }

  appendVNode(vnode, container);

  previousVNodes.set(container, vnode);
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
