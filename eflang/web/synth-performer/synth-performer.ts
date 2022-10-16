import * as Tone from "tone";

import type { Performer } from "@eflang/ef.interpreter-api";
import { Note } from "@eflang/ef.lang";

export class SynthPerformer implements Performer {
  #synth = new Tone.Synth().toDestination();

  play(note: Note): void {
    this.#synth.triggerAttackRelease(convertNote(note), "8n");
  }

  reset(): void {}
}

function convertNote(note: Note): Tone.Unit.Note {
  return `${note.note}${note.octave}`;
}