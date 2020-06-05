import React, { useState } from "react";
import {
  Avatar,
  FormControl,
  FormHelperText,
  Paper,
  Input,
  InputLabel,
  Button,
  ButtonGroup,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Slide,
  Typography,
} from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
import { Gavel, VerifiedUserTwoTone } from "@material-ui/icons";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

const CREATE_USER = gql`
  mutation($username: String!, $email: String!, $password: String!) {
    createUser(username: $username, email: $email, password: $password) {
      user {
        username
        email
      }
    }
  }
`;

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

export default function Register() {
  // First arg to makeStyles input function provides access to global MUI theme
  // from React context
  // https://material-ui.com/styles/api/#makestyles-styles-options-hook
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
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: "100%",
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    submit: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
    dialogIcon: {
      padding: "0px 2px 2px 0px",
      verticalAlign: "middle",
    },
  }));
  const classes = useStyles();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const [
    createUser,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation(CREATE_USER);

  // Handlers
  const handleSubmit = async (e, fn) => {
    e.preventDefault();
    // Make loading/error messages available
    setSnackOpen(true);
    const res = await fn({ variables: { username, email, password } });
    //
    setDialogOpen(true);
    console.log("res", res);
  };

  const handleClose = () => {
    // TODO: handle dialog / snackbar close behaviour
  };

  // Render component
  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Avatar className={classes.avatar}>
          <Gavel />
        </Avatar>
        <Typography variant="h5">Create User Account</Typography>
        <form
          className={classes.form}
          onSubmit={(e) => handleSubmit(e, createUser)}
        >
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="username">Username</InputLabel>
            <Input
              id="username"
              onChange={(e) => setUsername(e.target.value)}
            ></Input>
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="email">Email</InputLabel>
            <Input
              id="email"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              aria-describedby="email-helper-text"
            />
            <FormHelperText id="email-helper-text">
              We'll never share your email.
            </FormHelperText>
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
              type="submit"
              variant="contained"
              color="primary"
              disabled={
                mutationLoading ||
                !username.trim() ||
                !email.trim() ||
                !password.trim()
              }
            >
              {mutationLoading ? "Registering..." : "Register"}
            </Button>
            <Button variant="outlined" color="secondary">
              Already registered? Log in here
            </Button>
          </ButtonGroup>
        </form>
        {mutationError && (
          <Snackbar
            open={snackOpen}
            autoHideDuration={6000}
            message="Registration failed. Please try again."
          />
        )}
      </Paper>
      <Dialog
        disableBackdropClick={true}
        open={dialogOpen}
        TransitionComponent={Transition}
      >
        <DialogTitle>
          <VerifiedUserTwoTone className={classes.dialogIcon} />
          Registration successful!
        </DialogTitle>
        <DialogContent>
          <DialogContentText>New account created.</DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
}
