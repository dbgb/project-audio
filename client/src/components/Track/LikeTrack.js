import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { FavoriteBorder } from "@material-ui/icons";

export default function LikeTrack() {
  // Hook into MUI stylesheet
  const classes = useStyles();

  return (
    <div>
      <FavoriteBorder className={classes.icon} />
    </div>
  );
}

// MUI component styling
const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
}));
