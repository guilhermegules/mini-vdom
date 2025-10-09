import { currentComponent, hook, renderComponent } from "@vdom";

export function useState<T>(
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const instance = currentComponent;
  let states = hook.states;
  const index = hook.index++;

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

  const value = hook.states[index];

  return [value, setState];
}
