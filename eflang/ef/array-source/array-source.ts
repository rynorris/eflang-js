import type { MusicSource } from "@eflang/ef.interpreter-api";
import type { Instruction } from "@eflang/ef.lang";

export class ArraySource implements MusicSource {
    #program: Instruction[];
    #loc: number;

    constructor(program: Instruction[]) {
        this.#program = program;
        this.reset();
    }

    loc(): number {
        return this.#loc;
    }

    seek(loc: number): void {
        if (loc >= this.#program.length) {
            throw new Error("Out of bounds");
        }

        this.#loc = loc;
    }

    hasNext(): boolean {
        return this.#loc < this.#program.length;
    }

    next(): Instruction {
        const instruction = this.#program[this.#loc];
        this.#loc += 1;
        return instruction;
    }

    reset(): void {
        this.#loc = 0;
    }
}