import React, { useState } from "react";
import Button from "@material-ui/core/Button";

function App() {
  const [val, setVal] = useState(0);

  function incrementVal() {
    setVal(val + 1);
  }

  return (
    <div className="App">
      <header className="App-header">
        <Button variant="contained" color="primary" onClick={incrementVal}>
          Click me!
        </Button>
        <span> Value: {val}</span>
      </header>
    </div>
  );
}

export default App;
