import { createElement, render } from "./vdom.ts";
import { useEffect, useState } from "./hooks";

function Button(props: { onClick: () => void; label: string }) {
  return createElement(
    "button",
    { onclick: props.onClick, className: "btn-primary" },
    props.label
  );
}

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("Mounted or count changed:", count);
    return () => {
      console.log("Cleanup effect");
    };
  }, [count]);

  return createElement(
    "div",
    { id: "app-container" },
    createElement("h1", { className: "title" }, "Mini VDOM"),
    createElement(
      "ul",
      {},
      createElement("li", null, "Learn VDOM"),
      createElement("li", null, "Implement Diffing"),
      createElement("li", null, "Test with complex trees")
    ),
    createElement(Button, {
      label: "Click me",
      onClick: () => alert("Button clicked!"),
    }),
    createElement(
      "button",
      { onclick: () => setCount((c) => c + 1) },
      `count ${count}`
    ),
    "Some footer text here"
  );
}

render(createElement(App), document.getElementById("root")!);
