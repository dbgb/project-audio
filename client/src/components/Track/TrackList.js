import React from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  ExpansionPanelActions,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons/";
import LikeTrack from "../Track/LikeTrack";
import DeleteTrack from "../Track/DeleteTrack";
import UpdateTrack from "../Track/UpdateTrack";
import AudioPlayer from "../Shared/AudioPlayer";

export default function TrackList({ tracks }) {
  // Hook into MUI stylesheet
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <List className={classes.list}>
        {tracks.map((track) => (
          <ExpansionPanel key={track.id}>
            <ExpansionPanelSummary
              classes={{ content: classes.summary }}
              expandIcon={<ExpandMore />}
            >
              <ListItem disableGutters dense>
                <LikeTrack />
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
                />
                <AudioPlayer url={track.url} />
              </ListItem>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.details}>
              <Typography>{track.description}</Typography>
            </ExpansionPanelDetails>
            <ExpansionPanelActions>
              <UpdateTrack />
              <DeleteTrack />
            </ExpansionPanelActions>
          </ExpansionPanel>
        ))}
      </List>
    </div>
  );
}

// MUI Component Styling
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-evenly",
  },
  list: {
    flexBasis: "700px",
  },
  summary: {
    margin: 0,
  },
  details: {
    justifyContent: "center",
  },
  link: {
    color: theme.palette.secondary.main,
    textDecoration: "none",
    "&:hover": {
      color: theme.palette.secondary.dark,
    },
  },
}));
