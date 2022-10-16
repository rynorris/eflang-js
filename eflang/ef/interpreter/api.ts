
export type Octave = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export const NotesInOctave = ["A", "Bb", "B", "C", "C#", "D", "Eb", "E", "F", "F#", "G", "G#"] as const;

export interface Note {
    octave: Octave;
    note: (typeof NotesInOctave)[number];
}

export const Rest = "r";
export const LoopStart = "(";
export const LoopEnd = ")";

export type Instruction = Note | typeof Rest | typeof LoopStart | typeof LoopEnd;

export type BeatDivision = 1 | 2 | 4 | 8 | 16 | 32;
export interface BeatId {
    bar: number;
    beat: number;
    division: number;
}

export interface Performer {
    play(note: Note): void;
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
    next(): Instruction;
    reset(): void;
}

export interface IO {
    getInput(): Promise<number>;
    sendOutput(value: number): void;
}