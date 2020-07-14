import React, { useState } from "react";
import Register from "./Register";
import Login from "./Login";

/**
 * Send user to register/login, or redirect to main page if authenticated
 */
export default () => {
  const [isExistingUser, setIsExistingUser] = useState(true);

  return isExistingUser ? (
    // Default: take user to login page
    <Login setIsExistingUser={setIsExistingUser} />
  ) : (
    <Register setIsExistingUser={setIsExistingUser} />
  );
};
