import React, { useState, Fragment } from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import {
  Home,
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
              className={classes.menu}
            >
              {/* Mobile only start */}
              <MenuItem className={classes.mobileOnly}>
                <Link
                  to={`/`}
                  onDragStart={(e) => e.preventDefault()}
                  className={classes.mobileOnlyLink}
                >
                  <ListItemText
                    className={classes.mobileOnlyLabel}
                    variant="button"
                  >
                    Home
                  </ListItemText>
                  <ListItemIcon>
                    <Home fontSize="small" className={classes.mobileOnlyIcon} />
                  </ListItemIcon>
                </Link>
              </MenuItem>
              <MenuItem className={classes.mobileOnly}>
                <Link
                  to={`/uploads/${currentUser.id}`}
                  onDragStart={(e) => e.preventDefault()}
                  className={classes.mobileOnlyLink}
                >
                  <ListItemText
                    className={classes.mobileOnlyLabel}
                    variant="button"
                  >
                    Uploads
                  </ListItemText>
                  <ListItemIcon>
                    <MusicNote
                      fontSize="small"
                      className={classes.mobileOnlyIcon}
                    />
                  </ListItemIcon>
                </Link>
              </MenuItem>
              <MenuItem className={classes.mobileOnly}>
                <Link
                  to={`/profile/${currentUser.id}`}
                  onDragStart={(e) => e.preventDefault()}
                  className={classes.mobileOnlyLink}
                >
                  <ListItemText
                    className={classes.mobileOnlyLabel}
                    variant="button"
                  >
                    Profile
                  </ListItemText>
                  <ListItemIcon>
                    <Person
                      fontSize="small"
                      className={classes.mobileOnlyIcon}
                    />
                  </ListItemIcon>
                </Link>
              </MenuItem>
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
  menu: {},
  menuButton: {
    color: "#eee",
  },
  menuButtonIcon: {
    fontSize: "1.5em",
  },
  mobileOnly: {
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  mobileOnlyLink: {
    textDecoration: "none",
  },
  mobileOnlyIcon: {},
  mobileOnlyLabel: {},
}));
