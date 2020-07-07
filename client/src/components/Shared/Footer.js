import React from "react";
import { makeStyles } from "@material-ui/core/styles";

export default function Footer() {
  // Hook into MUI stylesheet
  const classes = useStyles();

  // Render footer
  return (
    <footer className={classes.root}>
      &copy;
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
    </footer>
  );
}

// MUI component styling
const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(2),
    color: theme.palette.secondary.main,
    fontSize: ".8em",
  },
  footerLink: {
    textDecorationStyle: "dotted",
    color: theme.palette.secondary.main,
  },
}));
