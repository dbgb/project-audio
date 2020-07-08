import React, { useState, Fragment } from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  IconButton,
} from "@material-ui/core";
import {
  Menu as Hamburger,
  RadioTwoTone,
  Person,
  MusicNote,
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import Logout from "../Auth/Logout";

export default function Header({ currentUser }) {
  // Hook into MUI stylesheet
  const classes = useStyles();

  // Component State
  // Store anchor element for menu
  const [anchorEl, setAnchorEl] = useState(null);

  // Handlers
  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Render component
  return (
    <AppBar position="static">
      <Toolbar>
        <Link
          to="/"
          onDragStart={(e) => e.preventDefault()}
          className={classes.growFirst}
        >
          <RadioTwoTone className={classes.logo} />
          <Typography variant="h4" noWrap>
            projectAudio
          </Typography>
        </Link>
        {currentUser && (
          <Fragment>
            {/* Navbar start */}
            <Link
              to={`/uploads/${currentUser.id}`}
              onDragStart={(e) => e.preventDefault()}
              className={classes.growAfter}
            >
              <MusicNote className={classes.navIcon} />
            </Link>
            <Link
              to={`/profile/${currentUser.id}`}
              onDragStart={(e) => e.preventDefault()}
              className={classes.growAfter}
            >
              <Person className={classes.navIcon} />
            </Link>
            {/* Menu start*/}
            <IconButton
              className={classes.menuButton}
              aria-controls="navMenu"
              aria-haspopup="true"
              size="small"
              onClick={handleClick}
            >
              <Hamburger />
            </IconButton>
            <Menu
              id="navMenu"
              anchorEl={anchorEl}
              keepMounted
              open={!!anchorEl}
              onClose={handleClose}
            >
              <MenuItem>
                <Logout />
              </MenuItem>
            </Menu>
            {/* Menu end */}
            {/* Navbar end */}
          </Fragment>
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
    outline: "none",
    color: "#eee",
  },
  growAfter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
    outline: "none",
    color: "#eee",
    margin: theme.spacing(0.5),
  },
  logo: {
    marginRight: theme.spacing(2),
    fontSize: "3em",
  },
  navIcon: {
    marginRight: theme.spacing(1),
    fontSize: "1.5em",
  },
  menuButton: {
    color: "#eee",
  },
}));
