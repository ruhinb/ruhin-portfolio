"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

// False during the server render and the first browser render, true afterwards.
// For things only the browser knows (theme, stored choices).
export function useMounted() {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}
