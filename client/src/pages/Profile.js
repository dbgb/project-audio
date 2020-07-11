import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";
import Loading from "../components/Shared/Loading";
import Error from "../components/Shared/Error";
import { CURRENT_USER } from "../Root";

export default function Profile() {
  // Hook into MUI stylesheet
  const classes = useStyles();

  // Component state
  const { loading, error, data } = useQuery(CURRENT_USER);

  if (loading) return <Loading linear />;
  else if (error) return <Error error={error} />;

  // Display date in human readable format, localized to user computer timezone
  let dateJoined = moment(data.me.dateJoined).format("MMMM Do YYYY, h:mm:ss a");

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <Typography
          className={classes.profile}
          variant="body1"
        >{`Welcome ${data.me.username}! (id: ${data.me.id})`}</Typography>
        <Typography className={classes.profile} variant="body2">
          Email: {data.me.email}
        </Typography>
        <Typography className={classes.profile} variant="body2">
          Date Joined: {dateJoined}
        </Typography>
      </div>
    </div>
  );
}

// MUI component styling
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
