import React, { useState } from "react";
import Register from "./Register";
import Login from "./Login";

/**
 * Send user to register/login, or trigger redirect to main page if
 * authenticated
 */
export default () => {
  // Index file in project root monitors client login state and controls whether
  // auth, or main app are rendered
  const [isExistingUser, setIsExistingUser] = useState(true);

  return isExistingUser ? (
    // Default: take user to login page
    <Login setIsExistingUser={setIsExistingUser} />
  ) : (
    <Register setIsExistingUser={setIsExistingUser} />
  );
};
