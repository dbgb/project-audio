import React from "react";
import { useApolloClient } from "@apollo/react-hooks";
import { Button, Typography } from "@material-ui/core";
import { ExitToApp } from "@material-ui/icons";

/**
 * Render Logout auth component
 */
export default function Logout() {
  // Hook into Apollo client state to allow direct write
  const client = useApolloClient();

  // Handlers
  const handleSubmit = () => {
    // Remove JWT from client
    localStorage.removeItem("authToken");
    // Then, update Apollo client state to reflect this change
    client.writeData({ data: { isLoggedIn: false } });
  };

  return (
    <Button
      size="small"
      variant="contained"
      color="primary"
      onClick={(e) => handleSubmit(e)}
      endIcon={<ExitToApp />}
      disableElevation
    >
      <Typography variant="button">Logout</Typography>
    </Button>
  );
}
