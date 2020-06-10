import React from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography } from "@material-ui/core";
import { RadioTwoTone, LibraryMusicTwoTone } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

export default function Header({ currentUser }) {
  // MUI component styling
  const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      margin: 0,
      padding: 0,
    },
    grow: {
      flexGrow: 1,
      display: "flex",
      alignItems: "center",
      textDecoration: "none",
    },
    logo: {
      marginRight: theme.spacing(2),
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
        <Link to="/" className={classes.grow}>
          <RadioTwoTone className={classes.logo} />
          <Typography variant="h5" noWrap>
            {/* TODO: Decide on project name! */}
            {process.env.REACT_APP_NAME || "Project Name"}
          </Typography>
        </Link>
        {currentUser && (
          <Link to={`/profile/${currentUser.id}`} className={classes.grow}>
            <LibraryMusicTwoTone
              className={classes.profileIcon}
            ></LibraryMusicTwoTone>
            <Typography variant="h5" className={classes.username} noWrap>
              {currentUser.username}
            </Typography>
          </Link>
        )}
      </Toolbar>
    </AppBar>
  );
}
