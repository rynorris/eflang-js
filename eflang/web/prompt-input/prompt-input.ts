import { InputManager } from "@eflang/ef.interpreter-api";

export class PromptInput implements InputManager {
  getInput(): Promise<number> {
    return new Promise(resolve => {
      resolve(parseInt(prompt("Input") || "0"));
    });
  }
}
