import { InterpreterEvent } from "@eflang/ef.interpreter-api";

export class EventBus implements InterpreterEvent.Bus {
    #listeners: { [E in InterpreterEvent.Name]: Set<InterpreterEvent.Listener<E>> } = {
        beforeStep: new Set(),
        afterStep: new Set(),
        output: new Set(),
        waitingForInput: new Set(),
        reset: new Set(),
    };

    public subscribe = <E extends InterpreterEvent.Name>(event: E, listener: InterpreterEvent.Listener<E>) => {
        this.#listeners[event].add(listener);
    }

    public unsubscribe = <E extends InterpreterEvent.Name>(event: E, listener: InterpreterEvent.Listener<E>) => {
        this.#listeners[event].delete(listener);
    }

    public broadcast = <E extends InterpreterEvent.Name>(event: E, payload: InterpreterEvent.Payload<E>) => {
        this.#listeners[event].forEach(listener => listener(payload));
    }
}