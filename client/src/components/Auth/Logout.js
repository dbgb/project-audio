import React from "react";
import { useHistory } from "react-router-dom";
import { useApolloClient } from "@apollo/react-hooks";
import { Button, Typography } from "@material-ui/core";
import { ExitToApp } from "@material-ui/icons";

/**
 * Render Logout auth component
 */
export default function Logout() {
  // Hook into Apollo client state to allow direct write
  const client = useApolloClient();
  const history = useHistory();

  // Handlers
  const handleSubmit = () => {
    // Reset domain path
    history.push("/");
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
