export type Octave = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export const NotesInOctave = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "G#", "A", "Bb", "B"] as const;

export interface Note {
    octave: Octave;
    note: (typeof NotesInOctave)[number];
}

export const Rest = "r";
export const LoopStart = "(";
export const LoopEnd = ")";

export type Instruction = Note | typeof Rest | typeof LoopStart | typeof LoopEnd;
