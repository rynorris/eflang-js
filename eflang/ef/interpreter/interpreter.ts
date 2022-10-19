import * as EF from "@eflang/ef.lang";
import { BeatDivision, IO, Metronome, MusicSource, Performer, Tape } from "@eflang/ef.interpreter-api";
import { EventName, EventListener, EventBus } from "./events";

export class Interpreter{
  #tape: Tape;
  #performer: Performer;
  #metronome: Metronome;
  #music: MusicSource;
  #io: IO;

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
    this.#direction = "up";

    this.#pause = null;
    this.#unpause = null;
    this.#hasPaused = null;
    this.#hasUnpaused = null;
    this.#hasStopped = null;
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
      await this.play(instruction);
      await this.execute(instruction);

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

  subscribe<E extends EventName>(event: E, listener: EventListener<E>): void {
    this.#events.subscribe(event, listener);
  }

  unsubscribe<E extends EventName>(event: E, listener: EventListener<E>): void {
    this.#events.unsubscribe(event, listener);
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

  private async play(instruction: EF.Instruction)  {
    if (instruction === EF.LoopStart || instruction === EF.LoopEnd) {
      return;
    }

    if (instruction === EF.Rest) {
    } else {
      this.#performer.play(instruction);
    }

    await this.awaitBeat();
  }

  private async awaitBeat() {
    await this.#metronome.next(null, this.#beatDivision);
  }

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
