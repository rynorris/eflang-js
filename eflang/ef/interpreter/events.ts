import * as EF from "@eflang/ef.lang"

interface EventTypes {
    afterStep: { instruction: EF.Instruction },
}

export type EventName = keyof EventTypes;
type EventPayload<E extends EventName> = EventTypes[E];
type Event<E extends EventName> = { type: E, payload: EventPayload<E> };

export type EventListener<E extends EventName> = (ev: Event<E>) => void;

export class EventBus {
    #listeners: { [E in EventName]: Set<EventListener<E>> } = {
        afterStep: new Set(),
    };

    subscribe<E extends EventName>(event: E, listener: EventListener<E>) {
        this.#listeners[event].add(listener);
    }

    unsubscribe<E extends EventName>(event: E, listener: EventListener<E>) {
        this.#listeners[event].delete(listener);
    }

    broadcast<E extends EventName>(event: E, payload: EventPayload<E>) {
        this.#listeners[event].forEach(listener => listener({ type: event, payload }));
    }
}