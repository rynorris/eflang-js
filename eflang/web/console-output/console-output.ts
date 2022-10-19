import { InterpreterEvent, InterpreterPlugin } from "@eflang/ef.interpreter-api";

export function ConsoleOutput(): InterpreterPlugin {
  const listener: InterpreterEvent.Listener<"output"> = ({ value }) => console.log(`[Output] ${value}`);
  return {
    register({ subscribe }) {
      subscribe("output", listener);
    },
    unregister({ unsubscribe }) {
      unsubscribe("output", listener);
    },
  };
}
