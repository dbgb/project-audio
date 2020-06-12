import React from "react";
import { Link } from "react-router-dom";
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
  return (
    <List>
      {tracks.map((track) => (
        <ExpansionPanel key={track.id}>
          <ExpansionPanelSummary expandIcon={<ExpandMore />}>
            <ListItem>
              <LikeTrack />
              <ListItemText
                primary={track.title}
                secondary={
                  <Link to={`/profile/${track.postedBy.id}`}>
                    {track.postedBy.username}
                  </Link>
                }
              />
              <AudioPlayer />
            </ListItem>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>{track.description}</Typography>
          </ExpansionPanelDetails>
          <ExpansionPanelActions>
            <UpdateTrack />
            <DeleteTrack />
          </ExpansionPanelActions>
        </ExpansionPanel>
      ))}
    </List>
  );
}
