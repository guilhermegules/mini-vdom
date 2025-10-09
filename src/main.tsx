import { useEffect, useRef, useState } from "@hooks";
import { createElement, render } from "@vdom";

function Button(props: { onClick: () => void; label: string }) {
  return <button onclick={props.onClick}>{props.label}</button>;
}

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log(count);
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
      <Button
        onClick={() => setCount((c) => c + 1)}
        label={`count ${count}`}
      ></Button>

      <footer>Some footer text here</footer>
    </div>
  );
}

render(<App />, document.getElementById("root")!);
