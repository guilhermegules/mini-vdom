import { currentComponent } from "../vdom/vdom";

export function useEffect(callback: () => void | (() => void), deps?: any[]) {
  currentComponent.effects.push({ callback, deps });
}
