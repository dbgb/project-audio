import React from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography } from "@material-ui/core";
import { RadioTwoTone, LibraryMusicTwoTone } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

export default function Header({ currentUser }) {
  // MUI component styling
  const useStyles = makeStyles((theme) => ({
    root: {
      margin: 0,
      padding: 0,
    },
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
      textDecoration: "none",
      color: "#eee",
    },
    logo: {
      marginRight: theme.spacing(1),
      fontSize: "3em",
    },
    profileIcon: {
      marginRight: theme.spacing(1),
      fontSize: "2em",
    },
  }));
  const classes = useStyles();

  // Component state

  // Render component
  return (
    <AppBar position="static" className={classes.root}>
      <Toolbar>
        <Link to="/" className={classes.growFirst}>
          <RadioTwoTone className={classes.logo} />
          <Typography variant="subtitle1" noWrap>
            {/* TODO: Decide on project name! */}
            {process.env.REACT_APP_NAME || "Project Name"}
          </Typography>
        </Link>
        {currentUser && (
          <Link to={`/profile/${currentUser.id}`} className={classes.growAfter}>
            <LibraryMusicTwoTone
              className={classes.profileIcon}
            ></LibraryMusicTwoTone>
            <Typography variant="subtitle1" className={classes.username} noWrap>
              {currentUser.username}
            </Typography>
          </Link>
        )}
      </Toolbar>
    </AppBar>
  );
}
