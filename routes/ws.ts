import { Handler } from "$fresh/server.ts";
import { LobbyBot } from "@logic/LobbyBot.ts";
import { defineMessage, validateMessage } from "@shared/rpc.ts";

export const handler: Handler = (req, _ctx) => {
    if (req.headers.get("upgrade") != "websocket") {
        return new Response(null, { status: 501 });
    }
    
    const authCode = new URL(req.url).searchParams.get("authCode");
    
    if (!authCode || authCode.length !== 32) {
        return new Response(null, { status: 400 });
    }
    
    const { socket, response } = Deno.upgradeWebSocket(req);
    
    const client = new LobbyBot(authCode, socket);
    
    const handler = client.getHandler();
    
    socket.onmessage = (event) => {
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
            socket.send(defineMessage("reportError", {
                error: {
                    message: error.message,
                    name: error.name
                }
            }));
        }
    };
    
    socket.onopen = async () => {
        try {
            await client.login();
        } catch (error) {
            socket.send(defineMessage("reportError", {
                error: {
                    message: error.message,
                    name: error.name
                }
            }));
            socket.close();
        }
    }
    
    socket.onclose = async () => {
        await client.logout();
    };
    
    return response;
};