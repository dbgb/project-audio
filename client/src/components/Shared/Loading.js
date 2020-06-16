import React from "react";
import { CircularProgress } from "@material-ui/core";

export default function Loading({ size = 40 }) {
  return <CircularProgress size={size} />;
}
