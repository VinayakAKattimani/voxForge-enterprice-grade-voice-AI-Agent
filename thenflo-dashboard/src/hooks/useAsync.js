import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Runs an async fetcher and exposes { data, status, error, reload }.
 * status is one of "loading" | "empty" | "error" | "success", matching
 * the four states every API-driven page must render.
 *
 * `isEmpty` lets a page define what "no data" means for its own shape
 * (e.g. an array with length 0, or a null record).
 */
export function useAsync(fetcher, deps = [], { isEmpty } = {}) {
  const [state, setState] = useState({ status: "loading", data: null, error: null });
  const requestId = useRef(0);

  const run = useCallback(() => {
    const id = ++requestId.current;
    setState((s) => ({ ...s, status: "loading", error: null }));
    fetcher()
      .then((data) => {
        if (id !== requestId.current) return;
        const empty = isEmpty ? isEmpty(data) : Array.isArray(data) ? data.length === 0 : !data;
        setState({ status: empty ? "empty" : "success", data, error: null });
      })
      .catch((err) => {
        if (id !== requestId.current) return;
        setState({ status: "error", data: null, error: err });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    run();
  }, [run]);

  return { ...state, reload: run };
}
