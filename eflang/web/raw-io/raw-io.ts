import { IO } from "@eflang/ef.interpreter-api";

export class RawIO implements IO {
  getInput(): Promise<number> {
    return Promise.resolve(parseInt(prompt("Input a number") ?? "0"));
  }

  sendOutput(value: number): void {
    console.log(`Output: ${value}`);
  }
}