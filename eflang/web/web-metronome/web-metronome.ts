import { BeatDivision, BeatId, Metronome } from "@eflang/ef.interpreter-api";

export class WebMetronome implements Metronome {
  #bpm: number;

  constructor(bpm: number) {
    this.#bpm = bpm;
  }

  next(beat: BeatId | null, division: BeatDivision): Promise<BeatId> {
    // TODO: Implement properly.
    const msPerBeat = 60_000 / this.#bpm;
    const msToWait = msPerBeat / division;
    return new Promise(resolve => setTimeout(resolve, msToWait));
  }

  reset(): void {}
}