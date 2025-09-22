import { createElement, render } from "./vdom.ts";
import { useEffect, useState } from "./hooks";

function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("Mounted or count changed:", count);
    return () => {
      console.log("Cleanup effect");
    };
  }, [count]);

  return createElement(
    "div",
    null,
    createElement("h1", { style: "color: blue" }, `Count: ${count}`),
    createElement(
      "button",
      { onclick: () => setCount((c) => c + 1) },
      "Increment"
    )
  );
}

render(createElement(Counter), document.getElementById("root")!);
