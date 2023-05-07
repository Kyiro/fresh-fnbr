import PartyInviteItem from "./PartyInviteItem.tsx";
import * as s from "@logic/signals.ts";

export default function MainScreen() {
    return <div class="flex gap center">
        <div>
            {s.partyInvites.value.map(i => <PartyInviteItem info={i} onDecline={() => {
                s.partyInvites.value = s.partyInvites.value.filter(x => i != x)
            }}/>)}
        </div>
        <div>
            <h2>Logged in as {s.username.value}</h2>
        </div>
    </div>;
}