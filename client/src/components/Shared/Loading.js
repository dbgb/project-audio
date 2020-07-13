import React from "react";
import PropTypes from "prop-types";
import { CircularProgress, LinearProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

/**
 * Provide visual feedback for app loading states
 */
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

Loading.propTypes = {
  /** For circular indicators: the diameter in pixels */
  size: PropTypes.number,
  /** Choose linear indicator if true, circular indicator if false */
  linear: PropTypes.bool,
};

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
