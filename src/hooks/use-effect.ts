import { currentComponent } from "@vdom";

const effects = new WeakSet<() => void | (() => void)>();

export function useEffect(callback: () => void | (() => void), deps?: any[]) {
  const effect = { callback, deps };

  if (effects.has(callback)) return;

  effects.add(callback);

  currentComponent.effects.push(effect);
}
