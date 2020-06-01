import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";

const GET_TRACKS_QUERY = gql`
  {
    tracks {
      title
    }
  }
`;

function App() {
  const [val, setVal] = useState(0);
  const { loading, error, data } = useQuery(GET_TRACKS_QUERY);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  function incrementVal() {
    setVal(val + 1);
  }

  let tracks = data.tracks.map(({ title }) => <div key={title}>{title}</div>);

  return (
    <div className="App">
      <header className="App-header">
        <Button variant="contained" color="primary" onClick={incrementVal}>
          Click me!
        </Button>
        <span> Value: {val}</span>
        {tracks}
      </header>
    </div>
  );
}

export default App;
