import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
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

export default function CreateTrack() {
  // Hook into MUI stylesheet
  const classes = useStyles();

  // Component state
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState("");

  // Handlers
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(file);
  };

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
    setFile(audioFile);
  };

  // Render component
  return (
    <>
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
            {/* Form body start */}
            <FormControl fullWidth>
              <TextField
                variant="outlined"
                label="Title"
                className={classes.textField}
                onChange={(e) => setTitle(e.target.value)}
              ></TextField>
            </FormControl>
            <FormControl fullWidth>
              <TextField
                variant="outlined"
                label="Description"
                className={classes.textField}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                rows="3"
              ></TextField>
            </FormControl>
            <FormControl className={classes.audioInputWrapper}>
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
                  className={classes.audioInputButton}
                  endIcon={<LibraryMusicOutlined />}
                >
                  {file ? "File selected" : "Select audio file"}
                </Button>
                <Typography display="inline" variant="subtitle2">
                  {/* Truncate display of excessively long track names */}
                  {file && (
                    <span>
                      {file.name.length > 30
                        ? file.name.substring(0, 30) + "\u2026" // Unicode ellipsis
                        : file.name}
                    </span>
                  )}
                </Typography>
              </label>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancel} startIcon={<Delete />}>
              Cancel
            </Button>
            <Button
              className={classes.upload}
              onClick={handleSubmit}
              startIcon={<CloudUpload />}
              disabled={!(title.trim() && description.trim() && file)}
            >
              Upload
            </Button>
          </DialogActions>
          {/* Form body end */}
        </form>
      </Dialog>
    </>
  );
}

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
  audioInputButton: {
    margin: theme.spacing(1),
    marginTop: theme.spacing(2),
  },
  upload: {
    color: "green",
  },
}));
