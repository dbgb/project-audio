import React, { useState } from "react";
import { Button, Snackbar } from "@material-ui/core/";

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
