import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { Avatar, Card, CardContent, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

export default function UserCard({ userID, username, dateJoined, email }) {
  // Hook into MUI stylesheet
  const classes = useStyles();

  // Display date in human readable format, localized to user computer timezone
  let readableDateJoined = moment(dateJoined).format("MMMM Do YYYY, h:mm:ss a");

  return (
    <div className={classes.container}>
      <Card className={classes.card} variant="outlined">
        <Avatar className={classes.avatar} variant="rounded">
          <Typography variant="h3">
            {username.charAt(0).toUpperCase()}
          </Typography>
        </Avatar>
        <CardContent className={classes.content}>
          <Typography
            className={classes.profile}
            variant="body1"
          >{`User: ${username} (ID: ${userID})`}</Typography>
          <Typography className={classes.profile} variant="body2">
            Email: {email}
          </Typography>
          <Typography className={classes.profile} variant="body2">
            Joined: {readableDateJoined}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}

UserCard.propTypes = {
  userID: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  dateJoined: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
};

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    margin: `${theme.spacing(2)}px 0px`,
  },
  card: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexBasis: "40vw",
    [theme.breakpoints.down("sm")]: {
      flex: 1,
    },
    backgroundColor: "#eee",
  },
  avatar: {
    backgroundColor: theme.palette.primary.light,
    marginLeft: theme.spacing(2),
    width: theme.spacing(8),
    height: theme.spacing(8),
  },
  content: {
    margin: theme.spacing(1),
  },
  profile: {
    padding: theme.spacing(0.5),
  },
}));
