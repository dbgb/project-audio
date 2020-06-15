import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Fab } from "@material-ui/core";
import { Add } from "@material-ui/icons";

export default function CreateTrack() {
  // Hook into MUI stylesheet
  const classes = useStyles();

  return (
    <div>
      {/* Use floating action button to present track creation as the primary action for the page */}
      <Fab
        className={classes.fab}
        color="primary"
        size="medium"
        variant="extended"
      >
        <Add className={classes.fabIcon} />
        Add Track
      </Fab>
      {/* Creation dialog */}
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  fab: {
    position: "fixed",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  fabIcon: {
    marginRight: theme.spacing(1),
  },
}));
