import React, { useState } from "react";
import Register from "./Register";
import Login from "./Login";

export default () => {
  // Send user to register/login, or redirect to main page if authenticated
  const [existingUser, setExistingUser] = useState(false);
  return existingUser ? (
    <Login />
  ) : (
    <Register setExistingUser={setExistingUser} />
  );
};
