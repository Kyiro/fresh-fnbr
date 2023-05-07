import { defineMessage, defineHandler, validateMessage } from "@shared/rpc.ts";
import * as s from "./signals.ts";

export class ClientWebSocket extends WebSocket {
    constructor(authCode: string) {
        s.isLoggingIn.value = true;
        
        super(`${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/ws?authCode=${authCode}`);
        
        const handler = this.getHandler();
        
        this.onclose = () => {
            s.isLoggingIn.value = false;
            s.isLoggingIn.value = false;
        };
        
        this.onmessage = (event) => {
            try {
                const [res, error] = validateMessage(JSON.parse(event.data));
            
                if (res) {
                    if (!(res.type in handler)) return;
                    // deno-lint-ignore no-explicit-any
                    (handler as any)[res.type](res.value);
                } else if (error) {
                    throw error;
                }
            } catch (error) {
                console.error(error);
                this.send(defineMessage("reportError", {
                    error: {
                        message: error.message,
                        name: error.name
                    }
                }));
            }
        };
    }
    
    joinParty(partyId: string) {
        this.send(defineMessage("joinParty", { partyId }));
    }
    
    getHandler() {
        return defineHandler({
            ready: (data) => {
                console.log("Logged in as", data.username);
                s.loggedIn.value = true;
                s.username.value = data.username;
            },
            partyInvite: (data) => s.partyInvites.value = [...s.partyInvites.value, data]
        });
    }
}