import React from "react";
import ReactPlayer from "react-player";
import { makeStyles } from "@material-ui/core/styles";

export default function AudioPlayer({
  url,
  height = "30px",
  width = "400px",
  controls = true,
}) {
  // Hook into MUI stylesheet
  const classes = useStyles();

  // Render component
  return (
    <div className={classes.root}>
      <ReactPlayer
        url={url}
        height={height}
        width={width}
        controls={controls}
        style={{}}
      />
    </div>
  );
}

// MUI Component Styling
const useStyles = makeStyles((theme) => ({
  root: {
    marginLeft: theme.spacing(1),
  },
}));
