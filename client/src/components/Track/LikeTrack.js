import React, { useContext, Fragment } from "react";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import { IconButton, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Favorite, FavoriteBorder } from "@material-ui/icons";
import { UserContext } from "../../Root";
import Error from "../Shared/Error";

export default function LikeTrack({ trackId, likeCount }) {
  // Hook into MUI stylesheet
  const classes = useStyles();

  // Determine if current user currently likes track
  const currentUser = useContext(UserContext);
  const isLiked = currentUser.likeSet.findIndex(({ track }) => {
    return track.id === trackId;
  });

  // Component state
  const [likeTrack, { error }] = useMutation(LIKE_TRACK);

  // Handlers
  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLiked === -1) {
      // Only allow like if user hasn't already liked track
      await likeTrack({
        variables: {
          trackId: trackId,
        },
      });
    }
  };

  // TODO: Change to correct icon on like without page refresh ref Apollo FetchPolicy
  // Render component
  return (
    <Fragment>
      <IconButton
        className={classes.likeButton}
        classes={{ label: classes.label }}
        size="small"
        onClick={(e) => handleLike(e)}
      >
        <Typography className={classes.likeCount} variant="subtitle2">
          {likeCount}
        </Typography>
        {isLiked === -1 ? (
          <FavoriteBorder className={classes.likeIcon} />
        ) : (
          <Favorite className={classes.likeIcon} />
        )}
      </IconButton>
      {error && <Error error={error} />}
    </Fragment>
  );
}

// Queries / Mutations
const LIKE_TRACK = gql`
  mutation($trackId: Int!) {
    likeTrack(trackId: $trackId) {
      track {
        id
        likes {
          id
        }
      }
    }
  }
`;

// MUI component styling
const useStyles = makeStyles((theme) => ({
  likeButton: {
    display: "flex",
  },
  label: {
    flexDirection: "column-reverse",
  },
  likeIcon: {
    color: theme.palette.primary.light,
    marginRight: theme.spacing(2),
  },
  likeCount: {
    marginRight: theme.spacing(2),
  },
}));
