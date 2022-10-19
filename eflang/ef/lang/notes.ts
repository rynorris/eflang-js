import type { Instruction, Note } from "./lang";
import { NotesInOctave } from "./lang";

export function note(note: Note["note"], octave: Note["octave"]): Note {
  return { note, octave };
}

export function isNote(instruction: Instruction): instruction is Note {
    return instruction["note"] !== undefined && instruction["octave"] !== undefined;
}

export function compareNotes(left: Note, right: Note): number {
    const octaveDifference = left.octave - right.octave;
    const noteDifference = NotesInOctave.indexOf(left.note) - NotesInOctave.indexOf(right.note);
    return octaveDifference * NotesInOctave.length + noteDifference;
}