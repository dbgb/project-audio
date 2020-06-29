import React, { useContext, Fragment } from "react";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import { IconButton, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Favorite, FavoriteBorder } from "@material-ui/icons";
import { UserContext } from "../../Root";
import { CURRENT_USER } from "../../Root";
import Error from "../Shared/Error";

export default function LikeTrack({ trackId, likeCount }) {
  // Hook into MUI stylesheet
  const classes = useStyles();

  // Determine if current user currently likes track
  const currentUser = useContext(UserContext);
  const isLiked =
    currentUser.likeSet.findIndex(({ track }) => {
      // Return boolean instead of cryptic '-1' for improved code readability
      return track.id === trackId;
    }) > -1;
  // Component state
  const [likeTrack, { error }] = useMutation(LIKE_TRACK, {
    refetchQueries: [{ query: CURRENT_USER }],
  });

  // Handlers
  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLiked) {
      // Only allow like if user hasn't already liked track
      await likeTrack({
        variables: {
          trackId: trackId,
        },
      });
    }
  };

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
        {isLiked ? (
          <Favorite className={classes.likeIcon} />
        ) : (
          <FavoriteBorder className={classes.likeIcon} />
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
    "&:hover": {
      backgroundColor: "transparent",
    },
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
