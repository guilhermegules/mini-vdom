import { useEffect, useRef, useState } from "@hooks";
import { createElement, render } from "@vdom";

function Button(props: { onClick: () => void; label: string }) {
  return <button onclick={props.onClick}>{props.label}</button>;
}

function App() {
  return (
    <div id="app-container">
      <h1>Mini VDOM</h1>
      <ul>
        <li>Learn VDOM</li>
        <li>Implement Diffing</li>
        <li>Test with complex trees</li>
      </ul>
      <Button onClick={() => alert("clicked")} label="Click"></Button>
      <button>count TODO</button>
      <footer>Some footer text here</footer>
    </div>
  );
}

render(<App />, document.getElementById("root")!);
