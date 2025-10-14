import React from "react";
import { Navigate } from "react-router-dom";

const adminIds = [process.env.REACT_APP_ADMIN_ID, process.env.REACT_APP_ADMIN_ID2];

function isAdmin(uid) {
  return adminIds.includes(uid);
}

export default function ProtectedRoute({ user, children }) {
  if (!user) {
    return <Navigate to="/login" />;
  }
  if (!isAdmin(user.user_id)) {
    return <Navigate to="/no-acceso" />;
  }
  return children;
}
