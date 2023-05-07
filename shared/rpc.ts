import * as z from "zod";

const PartyMember = z.object({
    id: z.string(),
    displayName: z.string().optional(),
    outfit: z.string().optional()
})

export const MessageKindsSchema = z.object({
    ready: z.object({
        username: z.string()
    }),
    partyInvite: z.object({
        partyId: z.string(),
        sender: z.string(),
        expiresAt: z.coerce.date()
    }),
    joinParty: z.object({
        partyId: z.string()
    }),
    updatePartyMembers: z.object({
        members: z.array(PartyMember)
    }),
    reportError: z.object({
        error: z.object({
            message: z.string(),
            name: z.string()
        }),
    })
});

export type MessageKinds = z.infer<typeof MessageKindsSchema>;

export type PartyInvite = MessageKinds["partyInvite"];

export type MessageCallbacks<K extends keyof MessageKinds = keyof MessageKinds> = {
    [key in K]: (value: MessageKinds[key]) => void;
};

export type Message<T extends keyof MessageKinds> = {
    type: T;
    value: MessageKinds[T];
};

export function defineMessage<T extends keyof MessageKinds>(
    type: T,
    value: MessageKinds[T]
): string {
    return JSON.stringify({ type, value });
}

export function defineHandler<T extends keyof MessageKinds>(
    callbacks: Partial<MessageCallbacks<T>>
): Partial<MessageCallbacks<T>> {
    return callbacks;
}

// make validateMessage use Message type
export function validateMessage(value: unknown): [Message<keyof MessageKinds> | undefined, z.ZodError | Error | undefined] {
    if (typeof value !== "object") {
        return [undefined, new Error("Message is not an object")];
    }
    
    if (value === null) {
        return [undefined, new Error("Message is null")];
    }
    
    if (!("type" in value)) {
        return [undefined, new Error("'type' property is missing")];
    }
    
    if (!("value" in value)) {
        return [undefined, new Error("'value' property is missing")];
    }
    
    if (typeof value.type !== "string") {
        return [undefined, new Error("'value.type' is not a string")];
    }
    
    const schema = MessageKindsSchema.pick({ [value.type]: z.any() });
    const result = schema.safeParse({ [value.type]: value.value });
    
    if (!result.success) {
        return [undefined, result.error];
    }
    
    return [
        value as Message<keyof MessageKinds>, 
        undefined
    ];
}