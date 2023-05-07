import { ClientWebSocket } from "@logic/clientWebsocket.ts";
import { useSignal } from "@preact/signals";
import * as s from "@logic/signals.ts";

const AUTHORIZATION_CODE_URL = Object.freeze("https://www.epicgames.com/id/api/redirect?clientId=3446cd72694c4a4485d81b77adbb2141&responseType=code");

export default function AuthScreen() {
    const inputText = useSignal("");
    const initWebSocket = () => {
        s.webSocket.value = new ClientWebSocket(inputText.value);
    };
    
    return <div class="flex gap center screen-height">
        <div>
            <h1>Kyiro's Fresh Lobby Bot</h1>
            <h3 class="no-margin">Please login using an authorization code. <a href={AUTHORIZATION_CODE_URL}>You can get it here.</a></h3> <br />
            <input class="full-width bottom-gap" type="text" size={32} maxLength={32} onInput={(event) => {
                const target = event?.target as HTMLInputElement;
                inputText.value = target.value;
            }}/>
            <button class="full-width" onClick={initWebSocket} disabled={s.isLoggingIn.value}>{s.isLoggingIn.value ? "Logging in..." : "Submit"}</button>
        </div>
    </div>;
}