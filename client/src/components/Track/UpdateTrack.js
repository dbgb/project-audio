import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  FormHelperText,
  TextField,
  Typography,
} from "@material-ui/core";
import {
  Delete,
  Edit,
  CloudUpload,
  LibraryMusicOutlined,
} from "@material-ui/icons";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import axios from "axios";
import Error from "../Shared/Error";
import Loading from "../Shared/Loading";
import { GET_TRACKS } from "../../pages/App";

// Constants
const fileSizeLimit = 10000000; // Bytes -> 10MB

export default function UpdateTrack({ track }) {
  // Hook into MUI stylesheet
  const classes = useStyles();

  // Component state
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(track.title);
  const [description, setDescription] = useState(track.description);
  const [file, setFile] = useState("");
  const [uploading, setUploading] = useState(false);
  const [fileSizeError, setFileSizeError] = useState("");
  const [updateTrack, { error: updateTrackError }] = useMutation(UPDATE_TRACK, {
    // Update main track listing UI after updating track
    refetchQueries: [{ query: GET_TRACKS }],
  });

  // Handlers
  const handleCancel = (e) => {
    e.preventDefault();
    // Close dialog model and reset file state
    setOpen(false);
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
      return { status: "uploaded", response: res.data.url };
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
      // TODO: Provide user feedback on audio upload error case
      console.log("Error: ", trackUrl.response);
      // Do not update track on GraphQL backend in error case
      return;
    }

    // After successful audio upload, create track on GraphQL backend with returned url
    await updateTrack({
      variables: {
        trackId: track.id,
        title,
        description,
        url: trackUrl.response,
      },
    });
    // Reset loading state, then close dialog on upload success
    setUploading(false);
    setOpen(false);
    setFile("");
  };
  // Render component
  return (
    <>
      <IconButton size="small" onClick={() => setOpen(true)}>
        <Edit />
      </IconButton>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        className={classes.dialog}
      >
        <form className={classes.root}>
          <DialogTitle>Update track</DialogTitle>
          <DialogContent>
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
                <Typography
                  display="inline"
                  variant="subtitle2"
                  className={classes.audioInputRow}
                >
                  {/* Truncate display of excessively long track names */}
                  {file && (
                    <span>
                      {file.name.length > 30
                        ? file.name.substring(0, 30) + "\u2026" // Unicode ellipsis
                        : file.name}
                    </span>
                  )}
                </Typography>
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
        {/* TODO: Set uploading to false in case of GraphQL backend error */}
        {updateTrackError && <Error error={updateTrackError} />}
      </Dialog>
    </>
  );
}

// Queries / Mutations
const UPDATE_TRACK = gql`
  mutation(
    $trackId: ID!
    $title: String!
    $description: String!
    $url: String!
  ) {
    updateTrack(
      trackId: $trackId
      title: $title
      description: $description
      url: $url
    ) {
      track {
        title
        description
        url
      }
    }
  }
`;

// MUI component styling
const useStyles = makeStyles((theme) => ({
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
