import React, { useState, Fragment } from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  IconButton,
  ListItemText,
  useMediaQuery,
} from "@material-ui/core";
import {
  Home,
  Menu as Hamburger,
  RadioTwoTone,
  Person,
  MusicNote,
} from "@material-ui/icons";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Logout from "../Auth/Logout";

export default function Header({ currentUser }) {
  // Hook into MUI stylesheet
  const classes = useStyles();
  const theme = useTheme();
  // Component State
  // Store anchor element for menu
  const [anchorEl, setAnchorEl] = useState(null);
  const mobile = useMediaQuery(theme.breakpoints.down("xs"));

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
          <Typography className={classes.title} variant="h4" noWrap>
            projectAudio
          </Typography>
        </Link>
        {currentUser && (
          <Fragment>
            {/* Navbar start */}
            <Link
              to={`/`}
              onDragStart={(e) => e.preventDefault()}
              className={classes.growAfter}
            >
              <Home className={classes.navIcon} />
            </Link>
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
              <Hamburger className={classes.menuButtonIcon} />
            </IconButton>
            <Menu
              id="navMenu"
              anchorEl={anchorEl}
              keepMounted
              open={!!anchorEl}
              onClose={handleClose}
            >
              {/* Mobile only start */}
              {mobile && (
                <div>
                  <Link
                    to={`/`}
                    onDragStart={(e) => e.preventDefault()}
                    className={classes.mobileOnlyLink}
                  >
                    <MenuItem
                      onClick={handleClose}
                      className={classes.mobileOnlyItem}
                    >
                      <ListItemText variant="button">Home</ListItemText>
                    </MenuItem>
                  </Link>
                  <Link
                    to={`/uploads/${currentUser.id}`}
                    onDragStart={(e) => e.preventDefault()}
                    className={classes.mobileOnlyLink}
                  >
                    <MenuItem
                      onClick={handleClose}
                      className={classes.mobileOnlyItem}
                    >
                      <ListItemText variant="button">Uploads</ListItemText>
                    </MenuItem>
                  </Link>
                  <Link
                    to={`/profile/${currentUser.id}`}
                    onDragStart={(e) => e.preventDefault()}
                    className={classes.mobileOnlyLink}
                  >
                    <MenuItem
                      onClick={handleClose}
                      className={classes.mobileOnlyItem}
                    >
                      <ListItemText variant="button">Profile</ListItemText>
                    </MenuItem>
                  </Link>
                </div>
              )}
              {/* Mobile only end */}
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
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  logo: {
    marginRight: theme.spacing(2),
    fontSize: "3em",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  title: {
    fontFamily: "'Major Mono Display', monospace, sans-serif",
    // fontFamily: "'La Belle Aurore', Roboto, sans-serif",
    // fontFamily: "'Delius Swash Caps', Roboto, sans-serif",
    overflow: "visible",
  },
  navIcon: {
    marginRight: theme.spacing(1),
    fontSize: "2em",
  },
  menuButton: {
    color: "#eee",
  },
  menuButtonIcon: {
    fontSize: "1.5em",
  },
  mobileOnlyItem: {
    textAlign: "center",
  },
  mobileOnlyLink: {
    textDecoration: "none",
  },
}));
