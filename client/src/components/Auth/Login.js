import React, { useState } from "react";
import {
  Avatar,
  FormControl,
  Paper,
  Input,
  InputLabel,
  Button,
  ButtonGroup,
  Typography,
} from "@material-ui/core/";
import { Lock } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import Error from "../Shared/Error";

const AUTH_USER = gql`
  mutation($username: String!, $password: String!) {
    tokenAuth(username: $username, password: $password) {
      token
    }
  }
`;

export default function Login({ setExistingUser }) {
  // MUI component styling
  const useStyles = makeStyles((theme) => ({
    root: {
      width: "auto",
      display: "block",
      marginLeft: theme.spacing(3),
      marginRight: theme.spacing(3),
      [theme.breakpoints.up("md")]: {
        width: 400,
        marginLeft: "auto",
        marginRight: "auto",
      },
    },
    paper: {
      marginTop: theme.spacing(8),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: theme.spacing(2),
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.primary.main,
    },
    form: {
      width: "100%",
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    formButton: {
      marginBottom: theme.spacing(1),
    },
    submit: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
  }));
  const classes = useStyles();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [
    tokenAuth,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation(AUTH_USER);

  // Handlers
  const handleSubmit = async (e, fn) => {
    e.preventDefault();
    const res = await fn({ variables: { username, password } });
    console.log("res", res);
  };

  // Render component
  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Avatar className={classes.avatar}>
          <Lock />
        </Avatar>
        <Typography variant="h5">Login</Typography>
        <form
          className={classes.form}
          onSubmit={(e) => handleSubmit(e, tokenAuth)}
        >
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="username">Username</InputLabel>
            <Input
              id="username"
              onChange={(e) => setUsername(e.target.value)}
            ></Input>
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="password">Password</InputLabel>
            <Input
              id="password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            ></Input>
          </FormControl>
          <ButtonGroup
            className={classes.submit}
            disableElevation
            orientation="vertical"
            fullWidth
          >
            <Button
              className={classes.formButton}
              type="submit"
              variant="contained"
              color="primary"
              disabled={mutationLoading || !username.trim() || !password.trim()}
            >
              {mutationLoading ? "Logging in..." : "Log in"}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setExistingUser(false)}
            >
              New user? Register here
            </Button>
          </ButtonGroup>
        </form>
        {mutationError && <Error error={mutationError} />}
      </Paper>
    </div>
  );
}
