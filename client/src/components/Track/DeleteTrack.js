import React, { useState, useContext, Fragment } from "react";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import { makeStyles } from "@material-ui/core/styles";
import { IconButton, Button, ClickAwayListener } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import { GET_TRACKS } from "../../pages/App";
import { UserContext } from "../../Root";
import Error from "./../Shared/Error";
import Loading from "./../Shared/Loading";

export default function DeleteTrack({ track }) {
  // Hook into MUI stylesheet
  const classes = useStyles();
  // Determine if the logged in user created the current track
  const currentUser = useContext(UserContext);
  const isTrackPoster = track.postedBy.id === currentUser.id;

  // Component state
  const [warn, setWarn] = useState(false);

  const updateCache = (cache, { data: { deleteTrack } }) => {
    // function: (cache: DataProxy, mutationResult: FetchResult)
    // Retrieve cached query data
    const data = cache.readQuery({ query: GET_TRACKS });
    // Create replacement cache object with deleted track removed (no mutation)
    const index = data.tracks.findIndex(
      (track) => Number(track.id) === deleteTrack.trackId
    );
    const tracks = [
      ...data.tracks.slice(0, index),
      ...data.tracks.slice(index + 1),
    ];
    // Refresh cache to trigger UI update after deleting tracks
    cache.writeQuery({ query: GET_TRACKS, data: { tracks } });
  };

  const [deleteTrack, { loading, error }] = useMutation(DELETE_TRACK, {
    // Update cache manually to refresh UI after deleting track
    update: updateCache,
  });

  // Handlers
  const handleDelete = async (e) => {
    e.preventDefault();
    // User has confirmed delete action
    setWarn(false);
    // Delete track on GraphQL backend
    await deleteTrack({
      variables: {
        trackId: track.id,
      },
    });
  };

  // Render component
  return (
    isTrackPoster && (
      <Fragment>
        <ClickAwayListener onClickAway={() => setWarn(false)}>
          {warn ? (
            <Button
              variant="outlined"
              size="small"
              className={classes.warn}
              startIcon={<Delete />}
              onClick={handleDelete}
            >
              Delete track?
            </Button>
          ) : (
            <IconButton size="small" onClick={() => setWarn(true)}>
              {loading ? <Loading size={20} /> : <Delete />}
            </IconButton>
          )}
        </ClickAwayListener>

        {error && <Error error={error} />}
      </Fragment>
    )
  );
}

// Queries / Mutations
const DELETE_TRACK = gql`
  mutation($trackId: Int!) {
    deleteTrack(trackId: $trackId) {
      trackId
    }
  }
`;

// MUI component styling
const useStyles = makeStyles((theme) => ({
  warn: {
    color: theme.palette.error.main,
  },
}));
