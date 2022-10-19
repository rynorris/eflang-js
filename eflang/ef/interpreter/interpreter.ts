import * as EF from "@eflang/ef.lang";
import { BeatDivision, InputManager, Metronome, MusicSource, InterpreterPlugin, Tape } from "@eflang/ef.interpreter-api";
import { EventBus } from "./event-bus";

export class Interpreter{
  #tape: Tape;
  #metronome: Metronome;
  #music: MusicSource;
  #input: InputManager;

  #prevNote: EF.Note | null = null;
  #beatDivision: BeatDivision = 1;
  #loopStack: number[] = [];
  #direction: "up" | "down" = "up";

  #pause: Promise<void> | null = null;
  #unpause: (() => void) | null = null;
  #hasPaused: (() => void) | null = null;
  #hasUnpaused: (() => void) | null = null;
  #hasStopped: (() => void) | null = null;

  #events: EventBus = new EventBus();

  constructor(tape: Tape, metronome: Metronome, music: MusicSource, input: InputManager) {
    this.#tape = tape;
    this.#metronome = metronome;
    this.#music = music;
    this.#input = input;
  }

  reset() {
    this.#tape.reset();
    this.#metronome.reset();
    this.#music.reset();

    this.#prevNote = null;
    this.#beatDivision = 1;
    this.#loopStack = [];
    this.#direction = "up";

    this.#pause = null;
    this.#unpause = null;
    this.#hasPaused = null;
    this.#hasUnpaused = null;
    this.#hasStopped = null;
  
    this.#events.broadcast("reset", {});
  }

  async perform() {
    while (this.#music.hasNext()) {
      if (this.#pause != null) {
        this.#hasPaused?.();
        await this.#pause;
        this.#hasUnpaused?.();
      }

      if (this.#hasStopped != null) {
        this.#hasStopped();
        return;
      }

      const instruction = this.#music.next();

      this.#events.broadcast("beforeStep", { instruction });
      await this.execute(instruction);

      if (instruction !== EF.LoopStart && instruction !== EF.LoopEnd) {
        await this.awaitBeat();
      }
      this.#events.broadcast("afterStep", { instruction });
    }
  }

  async pause(): Promise<void> {
    this.#pause = new Promise(resolve => {
      this.#unpause = resolve;
    });

    return new Promise(resolve => {
      this.#hasPaused = resolve;
    });
  }

  async unpause(): Promise<void> {
    this.#unpause?.();
    this.#pause = null;
    this.#unpause = null;

    return new Promise(resolve => {
      this.#hasUnpaused = resolve;
    });
  }

  async stop(): Promise<void> {
    this.unpause();

    return new Promise(resolve => {
      this.#hasStopped = resolve;
    });
  }

  register(plugin: InterpreterPlugin): void {
    plugin.register(this.#events);
  }

  unregister(plugin: InterpreterPlugin): void {
    plugin.unregister(this.#events);
  }

  private async execute(instruction: EF.Instruction) {
    if (instruction === EF.Rest) {
      await this.rest();
    } else if (instruction === EF.LoopStart) {
      this.startLoop();
    } else if (instruction === EF.LoopEnd) {
      this.endLoop();
    } else {
      this.note(instruction);
    }
  }

  private async awaitBeat() {
    await this.#metronome.next(null, this.#beatDivision);
  }

  private async rest() {
      if (this.#direction === "up") {
        this.#events.broadcast("output", { value: this.#tape.get() });
      } else {
        this.#events.broadcast("waitingForInput", {});
        this.#tape.set(await this.#input.getInput());
      }
  }

  private startLoop() {
      if (this.#tape.get() === 0) {
        this.skipLoop();
      } else {
        this.#loopStack.push(this.#music.loc());
        this.#beatDivision = (this.#beatDivision * 2) as BeatDivision;
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
      } else {
        this.#beatDivision = (this.#beatDivision / 2) as BeatDivision;
      }
  }

  private note(note: EF.Note) {
      if (this.#prevNote != null) {
        const cmp = EF.compareNotes(note, this.#prevNote);
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
      if (next === EF.LoopStart) {
        this.skipLoop();
      } else if (next === EF.LoopEnd) {
        return;
      }
    }
  }
};
