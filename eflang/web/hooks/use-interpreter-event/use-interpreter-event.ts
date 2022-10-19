import { InterpreterEvent, InterpreterPlugin } from "@eflang/ef.interpreter-api";
import React from "react";
import { useInterpreterPlugin } from "@eflang/web.hooks.use-interpreter-plugin";

export function useInterpreterEvent<E extends InterpreterEvent.Name>(event: E, listener: InterpreterEvent.Listener<E>) {
  const plugin: InterpreterPlugin = React.useMemo(() => ({
    register({ subscribe }) {
      subscribe(event, listener);
    },
    unregister({ unsubscribe }) {
      unsubscribe(event, listener);
    },
  }), [event, listener]);

  useInterpreterPlugin(plugin);
}
