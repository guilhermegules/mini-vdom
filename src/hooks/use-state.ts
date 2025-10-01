import { currentComponent, hook, renderComponent } from "../vdom/vdom";

export function useState<T>(
  initial: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const hooks = currentComponent.hooks;
  const index = hook.index++;

  if (hooks.length <= index) {
    hooks.push(initial);
  }

  const setState = (newValue: T | ((prev: T) => T)) => {
    hooks[index] =
      typeof newValue === "function"
        ? (newValue as Function)(hooks[index])
        : newValue;
    renderComponent(currentComponent.fn, currentComponent.container);
  };

  return [hooks[index], setState];
}
