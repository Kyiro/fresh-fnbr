import type { PartyInvite } from "@shared/rpc.ts";
import * as s from "@logic/signals.ts";

export default function PartyInviteItem(props: {
    info: PartyInvite,
    onDecline?: () => void
}) {
    return <div>
        <span>Invite from {props.info.sender}</span> <br />
        <button onClick={() => {
            s.webSocket.value?.joinParty(props.info.partyId);
            if (props.onDecline) props.onDecline();
        }}>Accept</button>
        <button onClick={() => {
            if (props.onDecline) props.onDecline();
        }}>Decline</button>
    </div>
}