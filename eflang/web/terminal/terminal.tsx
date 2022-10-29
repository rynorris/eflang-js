import React, { ReactNode } from 'react';
import { useInterpreterEvent } from "@eflang/web.hooks.use-interpreter-event";

interface InputOutput {
  type: "input" | "output";
  value: number;
}

export const Terminal = () => {
  const [values, setValues] = React.useState<InputOutput[]>([]);

  const acceptInput = React.useCallback((value: number) => {
    setValues(vs => [...vs, { type: "input", value }]);
  }, [setValues]);

  const acceptOutput = React.useCallback((value: number) => {
    setValues(vs => [...vs, { type: "output", value }]);
  }, [setValues]);

  useInterpreterEvent("output", ev => acceptOutput(ev.value));

  return (
    <div>
      {values.map((io, ix) => <div key={ix} className={io.type}>{io.value}</div>)}
    </div>
  );
};
