"use client";

// Any "Resume" button opens the one viewer on the page through this event,
// so the buttons and the viewer don't need to share state.
const EVENT = "ru:open-resume";

export function openResume() {
  window.dispatchEvent(new Event(EVENT));
}

export function onOpenResume(handler: () => void) {
  window.addEventListener(EVENT, handler);
  return () => window.removeEventListener(EVENT, handler);
}
