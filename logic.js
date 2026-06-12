// Solo single-player visual novel — all logic runs client-side in app.js.
// The platform requires a root rules module; this is the standard solo stub.
export const meta = { game: "medinovatech-academy", minPlayers: 1, maxPlayers: 1 };
export function setup() { return {}; }
export function validateAction() { return { ok: true }; }
export function applyAction(state) { return state; }
export function isGameOver() { return { over: false }; }
export function viewFor(state) { return state; }
