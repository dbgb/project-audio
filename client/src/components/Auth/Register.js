import React, { useState } from "react";
import PropTypes from "prop-types";
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
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  Typography,
} from "@material-ui/core/";
import { Gavel, VerifiedUserTwoTone, LockOpen } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import Error from "../Shared/Error";

const SlideTransition = React.forwardRef((props, ref) => {
  // forwardRef provides required access to the inner DOM node
  // https://material-ui.com/guides/composition/#caveat-with-refs
  return <Slide ref={ref} direction="down" {...props} />;
});

/**
 * Render Register auth component
 */
export default function Register({ setIsExistingUser }) {
  // Hook into MUI stylesheet
  const classes = useStyles();

  // Component state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [createUser, { loading, error }] = useMutation(CREATE_USER);

  // Handlers
  const handleSubmit = async (e) => {
    e.preventDefault();
    await createUser({ variables: { username, email, password } });
    setDialogOpen(true);
  };

  // Render component
  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Avatar className={classes.avatar}>
          <Gavel />
        </Avatar>
        <Typography variant="h5">Create User Account</Typography>
        <form className={classes.form} onSubmit={(e) => handleSubmit(e)}>
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
              className={classes.formButton}
              type="submit"
              variant="contained"
              color="primary"
              disabled={
                loading || !username.trim() || !email.trim() || !password.trim()
              }
            >
              {/* Loading state feedback */}
              {loading ? "Registering..." : "Register"}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setIsExistingUser(true)}
            >
              Already registered? Log in here
            </Button>
          </ButtonGroup>
        </form>
        {/* Fail state feedback */}
        {error && <Error error={error} />}
      </Paper>
      {/* Success state feedback */}
      <Dialog
        disableBackdropClick={true}
        open={dialogOpen}
        TransitionComponent={SlideTransition}
      >
        <DialogTitle>
          <VerifiedUserTwoTone className={classes.dialogIcon} />
          Registration successful!
        </DialogTitle>
        <DialogContent>
          <DialogContentText className={classes.dialogText}>
            Welcome aboard {username}!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            className={classes.dialogButton}
            variant="contained"
            color="primary"
            onClick={() => setIsExistingUser(true)}
            endIcon={<LockOpen />}
          >
            Login
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

Register.propTypes = {
  /** Set true if user is already registered */
  setIsExistingUser: PropTypes.func.isRequired,
};

// Queries / Mutations
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

// MUI component styling
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
  dialogText: {
    textAlign: "center",
  },
  dialogIcon: {
    padding: "0px 2px 2px 0px",
    verticalAlign: "middle",
  },
  dialogButton: {
    width: "100%",
  },
}));
