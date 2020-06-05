import React from "react";
import Register from "./Register";
import Login from "./Login";

export default function index() {
  // Send user to register/login, or redirect to main page if authenticated
  return <Register />;
}
