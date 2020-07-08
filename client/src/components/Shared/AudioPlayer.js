import React from "react";
import { makeStyles } from "@material-ui/core/styles";

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

// MUI Component Styling
const useStyles = makeStyles((theme) => ({
  root: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(0.5),
  },
  player: {
    borderRadius: "20px",
    filter: "invert(100%) grayscale(100%)",
    width: "460px",
    height: "30px",
  },
}));
