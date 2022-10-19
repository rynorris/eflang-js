import * as EF from "@eflang/ef.lang";

export type BeatDivision = 1 | 2 | 4 | 8 | 16 | 32;
export interface BeatId {
    bar: number;
    beat: number;
    division: number;
}

export interface Metronome {
    next(beat: BeatId | null, division: BeatDivision): Promise<BeatId>;
    reset(): void;
}

export interface Tape {
    left(): void;
    right(): void;
    inc(): void;
    dec(): void;
    get(): number;
    set(value: number): void;
    reset(): void;
}

export interface MusicSource {
    loc(): number;
    seek(loc: number): void;
    hasNext(): boolean;
    next(): EF.Instruction;
    reset(): void;
}

export interface InputManager {
    getInput(): Promise<number>;
}

export namespace InterpreterEvent {
    interface EventTypes {
        beforeStep: { instruction: EF.Instruction },
        afterStep: { instruction: EF.Instruction },
        output: { value: number },
        waitingForInput: {},
        reset: {},
    }

    export type Name = keyof EventTypes;
    export type Payload<E extends Name> = EventTypes[E];
    export type Listener<E extends Name> = (payload: Payload<E>) => void;

    export interface Bus {
        subscribe<E extends Name>(event: E, listener: Listener<E>): void;
        unsubscribe<E extends Name>(event: E, listener: Listener<E>): void;
    }
}

export interface InterpreterPlugin {
    register(bus: InterpreterEvent.Bus): void;
    unregister(bus: InterpreterEvent.Bus): void;
}