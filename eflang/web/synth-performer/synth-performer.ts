import * as Tone from "tone";

import type { InterpreterEvent, InterpreterPlugin } from "@eflang/ef.interpreter-api";
import { isNote, Note } from "@eflang/ef.lang";

export function SynthPerformer(): InterpreterPlugin {
  const synth = new Tone.Synth().toDestination();

  const listener: InterpreterEvent.Listener<"beforeStep"> = ({ instruction }) => {
    if (isNote(instruction)) {
      synth.triggerAttackRelease(convertNote(instruction), "8n", Tone.now());
    }
  };

  return {
    register({ subscribe }) {
      subscribe("beforeStep", listener);
    },
    unregister({ unsubscribe }) {
      unsubscribe("beforeStep", listener);
    },
  };
}

function convertNote(note: Note): Tone.Unit.Note {
  return `${note.note}${note.octave}`;
}