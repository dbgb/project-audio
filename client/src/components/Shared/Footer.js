import React from "react";
import { makeStyles } from "@material-ui/core/styles";

export default function Footer() {
  // Hook into MUI stylesheet
  const classes = useStyles();

  // Render footer
  return (
    <div className={classes.root}>
      Made by
      <a
        className={classes.footerLink}
        target="_blank"
        rel="noopener noreferrer"
        href="https://github.com/dbgb"
      >
        &nbsp;dbgb
      </a>
      .&nbsp;Favicon by
      <a
        className={classes.footerLink}
        target="_blank"
        rel="noopener noreferrer"
        href="https://icons8.com"
      >
        &nbsp;icons8
      </a>
      .
    </div>
  );
}

// MUI component styling
const useStyles = makeStyles((theme) => ({
  root: {
    position: "fixed",
    bottom: theme.spacing(2),
    left: theme.spacing(2),
    color: theme.palette.secondary.main,
    fontSize: ".8em",
    zIndex: -1,
  },
  footerLink: {
    textDecorationStyle: "dotted",
    color: theme.palette.secondary.main,
  },
}));
