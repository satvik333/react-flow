import './styles.css';
import React, { lazy, useEffect, memo } from "react"
const FlowPlayground = lazy(() => import("./FlowPlayground"))

function App() {
  return (
    <div className="App">
        <FlowPlayground />
    </div>
  );
}

export default App;
