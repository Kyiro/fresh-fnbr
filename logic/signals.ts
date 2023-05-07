import { signal } from "@preact/signals";
import type { ClientWebSocket } from "./clientWebsocket.ts";
import type { PartyInvite } from "@shared/rpc.ts";

export const webSocket = signal<ClientWebSocket | null>(null);
export const loggedIn = signal(false);
export const isLoggingIn = signal(false);
export const partyInvites = signal<PartyInvite[]>([]);
export const username = signal("User");