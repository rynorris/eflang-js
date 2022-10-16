import { BeatDivision, Instruction, IO, LoopEnd, LoopStart, Metronome, MusicSource, Note, Performer, Rest, Tape } from "./api";
import { compareNotes } from "./notes";

export class Interpreter{
  #tape: Tape;
  #performer: Performer;
  #metronome: Metronome;
  #music: MusicSource;
  #io: IO;

  #prevNote: Note | null = null;
  #beatDivision: BeatDivision = 1;
  #loopStack: number[] = [];
  #direction: "up" | "down" = "up";

  constructor(tape: Tape, performer: Performer, metronome: Metronome, music: MusicSource, io: IO) {
    this.#tape = tape;
    this.#performer = performer;
    this.#metronome = metronome;
    this.#music = music;
    this.#io = io;
  }

  reset() {
    this.#tape.reset();
    this.#metronome.reset();
    this.#performer.reset();
    this.#music.reset();

    this.#prevNote = null;
    this.#beatDivision = 1;
    this.#loopStack = [];
  }

  async perform() {
    while (this.#music.hasNext()) {
      const instruction = this.#music.next();
      this.play(instruction);
      await this.execute(instruction);
      await this.awaitBeat();
    }
  }

  private async execute(instruction: Instruction) {
    if (instruction === Rest) {
      await this.rest();
    } else if (instruction === LoopStart) {
      this.startLoop();
    } else if (instruction === LoopEnd) {
      this.endLoop();
    } else {
      this.note(instruction);
    }
  }

  private play(instruction: Instruction)  {}

  private async awaitBeat() {}

  private async rest() {
      if (this.#direction === "up") {
        this.#io.sendOutput(this.#tape.get());
      } else {
        this.#tape.set(await this.#io.getInput());
      }
  }

  private startLoop() {
      if (this.#tape.get() === 0) {
        this.skipLoop();
      } else {
        this.#loopStack.push(this.#music.loc());
      }
  }

  private endLoop() {
      const loopStart = this.#loopStack.pop();
      if (loopStart == null) {
        throw Error("Unmatched loop end!");
      }

      if (this.#tape.get() !== 0) {
        this.#music.seek(loopStart);
        this.#loopStack.push(loopStart);
      }
  }

  private note(note: Note) {
      if (this.#prevNote != null) {
        const cmp = compareNotes(note, this.#prevNote);
        if (cmp > 0) {
          this.#tape.right();
          this.#direction = "up";
        } else if (cmp < 0) {
          this.#tape.left();
          this.#direction = "down";
        } else {
          if (this.#direction === "up") {
            this.#tape.inc();
          } else {
            this.#tape.dec();
          }
        }
      }

      this.#prevNote = note;
  }

  private skipLoop() {
    while (this.#music.hasNext()) {
      const next = this.#music.next();
      if (next === LoopStart) {
        this.skipLoop();
      } else if (next === LoopEnd) {
        return;
      }
    }
  }
};
