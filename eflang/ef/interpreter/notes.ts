import { Note, NotesInOctave } from "./api";

export function compareNotes(left: Note, right: Note): number {
    const octaveDifference = left.octave - right.octave;
    const noteDifference = NotesInOctave.indexOf(left.note) - NotesInOctave.indexOf(right.note);
    return octaveDifference * NotesInOctave.length + noteDifference;
}