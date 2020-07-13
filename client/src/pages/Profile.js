import React from "react";
import moment from "moment";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { useParams } from "react-router-dom";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import Loading from "../components/Shared/Loading";
import Error from "../components/Shared/Error";

/**
 * Determine a registered user from url params, then display their profile
 */
export default function Profile() {
  const classes = useStyles();

  // Access user id from url params
  const { id } = useParams();

  const { loading, error, data } = useQuery(USER_FROM_ID, {
    variables: { id: id },
  });

  if (loading) return <Loading linear />;
  else if (error) return <Error error={error} />;

  const userInfo = data.user;

  // Display date in human readable format, localized to user computer timezone
  let dateJoined = moment(userInfo.dateJoined).format(
    "MMMM Do YYYY, h:mm:ss a"
  );

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <Typography
          className={classes.profile}
          variant="body1"
        >{`User: ${userInfo.username} (id: ${userInfo.id})`}</Typography>
        <Typography className={classes.profile} variant="body2">
          Email: {userInfo.email}
        </Typography>
        <Typography className={classes.profile} variant="body2">
          Date Joined: {dateJoined}
        </Typography>
      </div>
    </div>
  );
}

const USER_FROM_ID = gql`
  query($id: Int!) {
    user(id: $id) {
      id
      username
      email
      dateJoined
      trackSet {
        id
        title
      }
      likeSet {
        track {
          id
          title
        }
      }
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: theme.spacing(1),
  },
  container: {
    flexBasis: "768px",
    margin: theme.spacing(1),
  },
  profile: {
    padding: theme.spacing(0.5),
  },
}));
