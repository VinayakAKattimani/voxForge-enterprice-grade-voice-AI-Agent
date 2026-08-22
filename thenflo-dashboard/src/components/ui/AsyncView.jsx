import React from "react";
import LoadingState from "./LoadingState.jsx";
import ErrorState from "./ErrorState.jsx";
import EmptyState from "./EmptyState.jsx";

/**
 * Renders the four states every API-driven page must support: loading,
 * error (with retry), empty, and success. Pages pass a `useAsync` result
 * plus render props for the empty/success cases.
 */
export default function AsyncView({ state, empty, children }) {
  const { status, data, error, reload } = state;
  if (status === "loading") return <LoadingState />;
  if (status === "error") return <ErrorState message={error?.message} onRetry={reload} />;
  if (status === "empty") return empty ?? <EmptyState />;
  return children(data);
}
