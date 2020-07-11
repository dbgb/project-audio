import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  ExpansionPanelActions,
  List,
  ListItem,
  ListItemText,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import { ExpandMore, QueueMusicTwoTone } from "@material-ui/icons/";
import LikeTrack from "../Track/LikeTrack";
import DeleteTrack from "../Track/DeleteTrack";
import UpdateTrack from "../Track/UpdateTrack";
import AudioPlayer from "../Shared/AudioPlayer";

export default function TrackList({ tracks, editable = false }) {
  // Hook into MUI stylesheet
  const classes = useStyles();
  const theme = useTheme();
  const notMobile = useMediaQuery(theme.breakpoints.up("sm"));
  const mobile = useMediaQuery(theme.breakpoints.down("xs"));

  return (
    <div className={classes.root}>
      <List className={classes.list}>
        {tracks.length < 1 ? (
          <QueueMusicTwoTone className={classes.icon} />
        ) : (
          tracks.map((track) => (
            <ExpansionPanel key={track.id}>
              {/* Summary Start */}
              <ExpansionPanelSummary
                classes={{ content: classes.summary }}
                expandIcon={<ExpandMore />}
              >
                <ListItem disableGutters dense>
                  {notMobile && (
                    <Fragment>
                      <LikeTrack
                        trackId={track.id}
                        likeCount={track.likes.length}
                      />
                      <ListItemText
                        primary={track.title}
                        secondary={
                          <Link
                            to={`/profile/${track.postedBy.id}`}
                            className={classes.link}
                          >
                            {track.postedBy.username}
                          </Link>
                        }
                        className={classes.listItemText}
                      />
                    </Fragment>
                  )}
                  {mobile && (
                    <Typography
                      variant="caption"
                      display="inline"
                      className={classes.mobileTitle}
                    >
                      {track.title}
                    </Typography>
                  )}
                  <AudioPlayer url={track.url} />
                </ListItem>
              </ExpansionPanelSummary>
              {/* Summary End */}
              {/* Details Start */}
              <ExpansionPanelDetails className={classes.details}>
                {mobile && (
                  <LikeTrack
                    trackId={track.id}
                    likeCount={track.likes.length}
                  />
                )}
                <Typography>{track.description}</Typography>
              </ExpansionPanelDetails>
              {/* Details End */}
              {editable && (
                <ExpansionPanelActions>
                  <UpdateTrack track={track} />
                  <DeleteTrack track={track} />
                </ExpansionPanelActions>
              )}
            </ExpansionPanel>
          ))
        )}
      </List>
    </div>
  );
}

// MUI Component Styling
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
  },
  list: {
    flexBasis: "768px",
    textAlign: "center",
  },
  icon: {
    color: theme.palette.primary.light,
    fontSize: "32rem",
    opacity: "30%",
  },
  summary: {
    margin: 0,
  },
  details: {
    alignItems: "center",
    justifyContent: "space-around",
    [theme.breakpoints.down("xs")]: {
      justifyContent: "center",
    },
  },
  listItemText: {
    paddingLeft: theme.spacing(1),
  },
  link: {
    color: theme.palette.secondary.main,
    textDecoration: "none",
    "&:hover": {
      color: theme.palette.secondary.dark,
    },
  },
  mobileTitle: {
    width: "100px",
    marginRight: theme.spacing(0.5),
  },
}));
