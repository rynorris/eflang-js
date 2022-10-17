import * as Tone from "tone";

import type { Performer } from "@eflang/ef.interpreter-api";
import { Note } from "@eflang/ef.lang";

export class SynthPerformer implements Performer {
  #synth: Tone.Synth<Tone.SynthOptions> | undefined;

  play(note: Note): void {
    if (this.#synth == null) {
      this.#synth = new Tone.Synth().toDestination();
    }
    this.#synth.triggerAttackRelease(convertNote(note), "8n", Tone.now());
  }

  reset(): void {}
}

function convertNote(note: Note): Tone.Unit.Note {
  return `${note.note}${note.octave}`;
}