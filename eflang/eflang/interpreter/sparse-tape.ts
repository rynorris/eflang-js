import { Tape } from "./api";

export class SparseTape implements Tape {
    #tape: { [key: number]: number } = {};
    #ptr = 0;

    left(): void {
        this.#ptr -= 1;
    }

    right(): void {
        this.#ptr += 1;
    }

    inc(): void {
        this.#tape[this.#ptr] = this.getOrZero(this.#ptr) + 1;
    }

    dec(): void {
        this.#tape[this.#ptr] = this.getOrZero(this.#ptr) - 1;
    }

    get(): number {
        return this.getOrZero(this.#ptr);
    }

    set(value: number): void {
        this.#tape[this.#ptr] = value;
    }

    reset(): void {
        this.#tape = {};
    }

    private getOrZero(ix: number): number {
        return this.#tape[ix] ?? 0;
    }
}