import { Client } from "fnbr";
import { defineHandler, defineMessage } from "@shared/rpc.ts";

export class LobbyBot extends Client {
    constructor(
        authorizationCode: string,
        private socket: WebSocket
    ) {
        super({
            auth: { authorizationCode },
            defaultStatus: "Fresh FNBR"
        });
        
        this.setupEvents();
    }
    
    setupEvents() {
        this.on("ready", () => {
            this.socket.send(defineMessage("ready", {
                username: this.user?.displayName ?? "None"
            }));
        });
        
        this.on("party:invite", (event) => {
            this.socket.send(defineMessage("partyInvite", {
                partyId: event.party.id,
                sender: event.sender.displayName ?? event.sender.id,
                expiresAt: event.expiresAt
            }));
        });
         
        this.on("party:updated", () => this.updatePartyMembers());
    }
    
    updatePartyMembers() {
        this.socket.send(defineMessage("updatePartyMembers", {
            members: Array.from((this.party?.members ?? new Map()).values())
        }));
    }
    
    getHandler() {
        return defineHandler({
            joinParty: ({ partyId }) => this.joinParty(partyId)
        });
    }
}