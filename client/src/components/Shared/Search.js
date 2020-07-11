import React, { useState } from "react";
import { useLazyQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { makeStyles } from "@material-ui/styles";
import { Paper, IconButton, TextField } from "@material-ui/core";
import { Clear, Search as SearchIcon } from "@material-ui/icons";
import Loading from "../Shared/Loading";
import Error from "../Shared/Error";

export default function Search({ setSearchResults }) {
  // Hook into MUI stylesheet
  const classes = useStyles();
  // Store current search return value
  const [searchField, setSearchField] = useState("");

  // useLazyQuery returns a function in its result tuple that can be called when
  // ready to execute the query.
  const [getSearch, { loading, error, data }] = useLazyQuery(
    GET_SEARCH_RESULTS,
    {
      onCompleted: () => setSearchResults(data.tracks),
      fetchPolicy: "cache-and-network",
    }
  );

  // Handlers
  const handleSubmit = (e) => {
    e.preventDefault();
    // Process search form
    getSearch({ variables: { search: searchField.toLowerCase() } });
  };

  const handleClear = (e) => {
    e.preventDefault();
    // Reset search field and results state
    setSearchField("");
    setSearchResults(null);
  };

  // Render component
  return (
    <form onSubmit={(e) => handleSubmit(e)} className={classes.root}>
      <Paper className={classes.paper} elevation={1}>
        <IconButton
          aria-label="clear search term"
          color="secondary"
          onClick={(e) => handleClear(e)}
        >
          <Clear />
        </IconButton>
        <TextField
          autoFocus
          placeholder="Search..."
          value={searchField}
          onChange={(e) => setSearchField(e.target.value)}
          InputProps={{ disableUnderline: true }}
          fullWidth
        />
        <IconButton
          aria-label="search tracks"
          color="primary"
          type="submit"
          onClick={(e) => handleSubmit(e)}
        >
          {loading ? <Loading size={24} /> : <SearchIcon />}
          {error && <Error error={error} />}
        </IconButton>
      </Paper>
    </form>
  );
}

// Queries / Mutations
const GET_SEARCH_RESULTS = gql`
  query($search: String!) {
    tracks(search: $search) {
      id
      title
      description
      url
      createdAt
      postedBy {
        id
        username
      }
      likes {
        id
      }
    }
  }
`;

// MUI Component Styling
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    marginTop: theme.spacing(1),
  },
  paper: {
    display: "flex",
    alignItems: "center",
    flexBasis: "768px",
    margin: `${theme.spacing(1)}px 0px`,
  },
}));
