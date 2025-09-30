import { currentComponent, hook } from "../vdom";

export function useRef<Type = unknown>(initialValue: Type): { current: Type } {
  const hooks = hook.states.get(currentComponent);

  if (hooks && hook.index >= hooks.length) {
    hooks.push({ current: initialValue });
  }

  return hooks?.[hook.index] ?? { current: null };
}
