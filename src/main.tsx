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

  return (
    <div id="app-container">
      <h1>Mini VDOM</h1>
      <ul>
        <li>Learn VDOM</li>
        <li>Implement Diffing</li>
        <li>Test with complex trees</li>
      </ul>
      <Button onClick={() => alert("clicked")} label="Click"></Button>
      <button
        onClick={() => {
          setCount((c) => c + 1);
        }}
        ref={(element: HTMLButtonElement) => {
          buttonRef.current = element;
          console.log("Button element", element);
        }}
      >
        count {count}
      </button>
      <Counter />
      <footer>Some footer text here</footer>
    </div>
  );
}

render(<App />, document.getElementById("root")!);
