import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";

/**
 * Render interactive audio player component
 */
export default function AudioPlayer({ url }) {
  // Hook into MUI stylesheet
  const classes = useStyles();

  // Render component
  return (
    <div className={classes.root}>
      <audio className={classes.player} src={url} preload="metadata" controls />
    </div>
  );
}

AudioPlayer.propTypes = {
  /** A valid https link to an audio file */
  url: PropTypes.string.isRequired,
};

// MUI Component Styling
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flex: "0 1 75%",
    [theme.breakpoints.down("xs")]: {
      flex: "0 1 100%",
    },
  },
  player: {
    width: "100%",
    borderRadius: "20px",
    filter: "invert(100%) grayscale(100%)",
    height: "40px",
  },
}));
