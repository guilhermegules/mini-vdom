import type { ComponentInstance } from "./types/component-instance.type";
import type { VNode } from "./types/vnode.type";

export let currentComponent: ComponentInstance;

export let hook = {
  index: 0,
};

const componentInstances = new WeakMap<HTMLElement, ComponentInstance>();

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
      children: children.flat(),
    },
  };
}

function createDom(vnode: VNode | string): Node {
  if (typeof vnode === "string") {
    return document.createTextNode(vnode);
  }

  const dom = document.createElement(vnode.type as string);

  for (const [key, value] of Object.entries(vnode.props || {})) {
    if (key !== "children") {
      // @ts-ignore
      dom[key] = value;
    }
  }

  for (const child of vnode.props.children || []) {
    dom.appendChild(createDom(child));
  }

  return dom;
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

  container.innerHTML = "";
  container.appendChild(createDom(vnode));
}
