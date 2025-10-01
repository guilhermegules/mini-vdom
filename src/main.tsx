import { useEffect, useRef, useState } from "@hooks";
import { createElement, render } from "@vdom";

function Button(props: { onClick: () => void; label: string }) {
  return createElement(
    "button",
    { onclick: props.onClick, className: "btn-primary" },
    props.label
  );
}

function Counter() {
  const [count, setCount] = useState(0);

  return createElement(
    "div",
    null,
    createElement("p", null, `Count: ${count}`),
    createElement(Button, {
      onClick: () => setCount(count + 1),
      label: "Increment",
    })
  );
}

function App() {
  const [count, setCount] = useState(0);
  const buttonRef = useRef({});

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
      {
        onclick: () => setCount((c) => c + 1),
        ref: (element: HTMLButtonElement) => {
          buttonRef.current = element;
          console.log("Button element", element);
        },
      },
      `count ${count}`
    ),
    createElement(Counter),
    "Some footer text here"
  );
}

render(createElement(App), document.getElementById("root")!);
