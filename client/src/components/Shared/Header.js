import React from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography } from "@material-ui/core";
import { RadioTwoTone, LibraryMusic } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import Logout from "../Auth/Logout";

export default function Header({ currentUser }) {
  // Hook into MUI stylesheet
  const classes = useStyles();

  // Render component
  return (
    <AppBar position="static">
      <Toolbar>
        <Link to="/" className={classes.growFirst}>
          <RadioTwoTone className={classes.logo} />
          <Typography variant="h4" noWrap>
            {/* TODO: Decide on project name! */}
            {process.env.REACT_APP_NAME || "Project Name"}
          </Typography>
        </Link>
        {/* Navbar start */}
        {currentUser && (
          <>
            <Link
              to={`/profile/${currentUser.id}`}
              className={classes.growAfter}
            >
              <LibraryMusic className={classes.profileIcon}></LibraryMusic>
            </Link>
            <Logout />
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

// MUI component styling
const useStyles = makeStyles((theme) => ({
  growFirst: {
    display: "flex",
    flexGrow: 1,
    alignItems: "center",
    textDecoration: "none",
    color: "#eee",
  },
  growAfter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
    color: "#eee",
    margin: theme.spacing(2),
  },
  logo: {
    marginRight: theme.spacing(2),
    fontSize: "3em",
  },
  profileIcon: {
    marginRight: theme.spacing(1),
    fontSize: "1.5em",
  },
}));
