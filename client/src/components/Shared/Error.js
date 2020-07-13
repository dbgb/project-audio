import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Snackbar } from "@material-ui/core/";

/**
 * Provide visual feedback for app error states
 */
export default function Error({ error }) {
  const [open, setOpen] = useState(true);

  return (
    <Snackbar
      open={open}
      message={error.message}
      action={
        <Button color="secondary" size="small" onClick={() => setOpen(false)}>
          Dismiss
        </Button>
      }
    />
  );
}

Error.propTypes = {
  /** An error object containing a message to be shown to the user */
  error: PropTypes.shape({
    message: PropTypes.string.isRequired,
  }).isRequired,
};
