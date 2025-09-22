import { currentComponent } from "../vdom";

export function useEffect(callback: () => void | (() => void), deps?: any[]) {
  currentComponent.effects.push({ callback, deps });
}
