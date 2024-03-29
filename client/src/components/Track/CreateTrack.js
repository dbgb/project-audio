import React, { useState, Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControl,
  FormHelperText,
  TextField,
  Typography,
} from "@material-ui/core";
import {
  Add,
  Delete,
  LibraryMusicOutlined,
  CloudUpload,
  Radio,
} from "@material-ui/icons";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import axios from "axios";
import Error from "../Shared/Error";
import Loading from "../Shared/Loading";
import { GET_TRACKS } from "../../pages/App";

// Constants
const fileSizeLimit = 10000000; // Bytes -> 10MB

/**
 * Handle the creation of new audio tracks and updating the client cache
 */
export default function CreateTrack() {
  // Hook into MUI stylesheet
  const classes = useStyles();

  // Component state
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState("");
  const [uploading, setUploading] = useState(false);
  const [fileSizeError, setFileSizeError] = useState("");

  const updateCache = (cache, { data: { createTrack } }) => {
    // Retrieve cached query data
    const data = cache.readQuery({ query: GET_TRACKS });
    // Create replacement cache object with new track added (no mutation)
    // N.B. copy must have same gql data shape as GET_TRACKS
    const tracks = data.tracks.concat(createTrack.track);
    // Refresh cache to trigger UI update after creating new tracks
    cache.writeQuery({ query: GET_TRACKS, data: { tracks } });
  };

  const [createTrack, { error: createTrackError }] = useMutation(CREATE_TRACK, {
    // Update cache manually to refresh UI after creating new track
    update: updateCache,
  });

  // Handlers
  const handleCancel = (e) => {
    e.preventDefault();
    // Close dialog model and reset track metadata state
    setOpen(false);
    setTitle("");
    setDescription("");
    setFile("");
  };

  const handleAudioChange = (e) => {
    // Discard all but first file from uploaded files array
    let audioFile = e.target.files.item(0);

    // Reject files over allowed size
    // Cloudinary free tier raw file size limit is 10MB
    if (audioFile.size > fileSizeLimit) {
      setFileSizeError(
        `Audio file size must not exceed ${fileSizeLimit / 1e6}MB.`
      );
      setFile("");
      return;
    }
    // Reset fileSizeError message in case of user retrying after previous attempt
    setFileSizeError("");
    setFile(audioFile);
  };

  const handleAudioUpload = async () => {
    // Use FormData Web API to create Cloudinary API compatible upload object
    // re: https://cloudinary.com/documentation/upload_images#uploading_with_a_direct_call_to_the_rest_api
    let formData = new FormData();
    formData.append("file", file);
    formData.append("resource_type", "raw");
    formData.append("cloud_name", "dbgb");
    formData.append("upload_preset", "project-audio");
    try {
      // Use Axios to send file via POST request to Cloudinary REST API
      // then return object with appropriate status and response values
      setUploading(true);
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dbgb/raw/upload",
        formData
      );
      return { status: "uploaded", response: res.data.secure_url };
    } catch (error) {
      // Cancel loading spinner and return error message for handling
      setUploading(false);
      return { status: "error", response: error.message };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trackUrl = await handleAudioUpload(); // {status: ..., data: ...}

    if (trackUrl.status === "error") {
      console.error("Error: ", trackUrl.response);
      // Do not create track on GraphQL backend in error case
      return;
    }

    // After successful audio upload, create track on GraphQL backend with returned url
    await createTrack({
      variables: { title, description, url: trackUrl.response },
    });
    // Reset loading state, then close dialog on upload success
    setUploading(false);
    setOpen(false);
    setTitle("");
    setDescription("");
    setFile("");
  };

  // Render component
  return (
    <Fragment>
      {/* Use floating action button as interface for track creation */}
      <Fab
        className={classes.fab}
        color={open ? "secondary" : "primary"}
        size="medium"
        variant="extended"
        onClick={() => setOpen(true)}
      >
        {open ? (
          <Radio className={classes.fabIcon} />
        ) : (
          <Add className={classes.fabIcon} />
        )}
        {open ? "Adding track ..." : "Add track"}
      </Fab>
      {/* Track creation dialog */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        className={classes.dialog}
      >
        <form className={classes.root}>
          <DialogTitle>Create new track</DialogTitle>
          <DialogContent>
            <DialogContentText variant="caption" align="center">
              Maximum upload file size is {fileSizeLimit / 1e6}MB.
            </DialogContentText>
            {/* Form body start */}
            <FormControl fullWidth>
              <TextField
                variant="outlined"
                label="Title"
                value={title}
                className={classes.textField}
                onChange={(e) => setTitle(e.target.value)}
              ></TextField>
            </FormControl>
            <FormControl fullWidth>
              <TextField
                variant="outlined"
                label="Description"
                value={description}
                className={classes.textField}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                rows="3"
              ></TextField>
            </FormControl>
            <FormControl
              className={classes.audioInputWrapper}
              error={!!fileSizeError}
            >
              {/* Use MUI button as file upload selector */}
              {/* re: https://material-ui.com/components/buttons/#upload-button */}
              <input
                id="audio-input"
                className={classes.audioInput}
                type="file"
                accept="audio/*"
                onChange={handleAudioChange}
                required
              />
              <label htmlFor="audio-input">
                <Button
                  variant="contained"
                  color={file ? "secondary" : "primary"}
                  component="span"
                  className={classes.audioInputRow}
                  endIcon={<LibraryMusicOutlined />}
                >
                  {file ? "File selected" : "Select audio file"}
                </Button>
                {file && (
                  <Typography
                    display="inline"
                    variant="subtitle2"
                    className={classes.audioInputRow}
                  >
                    {/* Truncate display of excessively long track names */}
                    <span>
                      {file.name.length > 30
                        ? file.name.substring(0, 30) + "\u2026" // Unicode ellipsis
                        : file.name}
                    </span>
                  </Typography>
                )}
                <FormHelperText>{fileSizeError}</FormHelperText>
              </label>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCancel}
              startIcon={<Delete />}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button
              className={classes.upload}
              onClick={handleSubmit}
              startIcon={<CloudUpload />}
              disabled={
                uploading || !(title.trim() && description.trim() && file)
              }
            >
              {uploading ? <Loading size={24} /> : "Upload"}
            </Button>
          </DialogActions>
          {/* Form body end */}
        </form>
        {/* Create track error handling */}
        {createTrackError && <Error error={createTrackError} />}
      </Dialog>
    </Fragment>
  );
}

// Queries / Mutations
const CREATE_TRACK = gql`
  mutation($title: String!, $description: String!, $url: String!) {
    createTrack(title: $title, description: $description, url: $url) {
      track {
        id
        title
        description
        url
        postedBy {
          id
          username
        }
        likes {
          id
        }
      }
    }
  }
`;

// MUI component styling
const useStyles = makeStyles((theme) => ({
  fab: {
    position: "fixed",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    zIndex: "1",
  },
  fabIcon: {
    marginRight: theme.spacing(1),
  },
  dialog: {
    margin: "0 auto",
    maxWidth: 550,
  },
  textField: {
    margin: theme.spacing(1),
  },
  audioInputWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  audioInput: {
    display: "none",
  },
  audioInputRow: {
    margin: theme.spacing(1.5, 1),
  },
  upload: {
    color: "green",
  },
}));
