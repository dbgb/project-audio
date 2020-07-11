import React from "react";
import { CircularProgress, LinearProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

export default function Loading({ size = 50, linear = false }) {
  const classes = useStyles();

  if (!linear) {
    return (
      <div className={classes.circularRoot}>
        <CircularProgress size={size} />
      </div>
    );
  } else {
    return (
      <div className={classes.linearRoot}>
        <LinearProgress />
      </div>
    );
  }
}

const useStyles = makeStyles((theme) => ({
  circularRoot: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  linearRoot: {
    width: "100vw",
  },
}));
