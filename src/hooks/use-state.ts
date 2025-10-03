import { currentComponent, hook, renderComponent } from "@vdom";

export function useState<T>(
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const instance = currentComponent;
  let states = hook.states.get(instance);
  const index = hook.index;

  if (!states) {
    states = [];
    hook.states.set(instance, states);
  }

  if (states.length <= index) {
    states.push(initialValue);
  }

  const setState = (newValue: T | ((prev: T) => T)) => {
    const prev = states[index];
    const next =
      typeof newValue === "function" ? (newValue as Function)(prev) : newValue;

    if (prev !== next) {
      states[index] = next;
      renderComponent(instance.fn, instance.container);
    }
  };

  const value = states[index];

  hook.index++;
  return [value, setState];
}
