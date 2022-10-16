import * as EF from "@eflang/ef.lang";

export type BeatDivision = 1 | 2 | 4 | 8 | 16 | 32;
export interface BeatId {
    bar: number;
    beat: number;
    division: number;
}

export interface Performer {
    play(note: EF.Note): void;
    reset(): void;
}

export interface Metronome {
    next(beat: BeatId, division: BeatDivision): Promise<BeatId>;
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

export interface IO {
    getInput(): Promise<number>;
    sendOutput(value: number): void;
}