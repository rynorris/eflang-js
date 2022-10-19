import { Metronome, MusicSource } from '@eflang/ef.interpreter-api';
import { SparseTape } from '@eflang/ef.sparse-tape';
import { Interpreter } from '@eflang/ef.interpreter';
import React from 'react';
import { WebMetronome } from '@eflang/web.web-metronome';

export type EfContextProps = {
  music: MusicSource;
  metronome?: Metronome,
  children?: React.ReactNode;
};

interface EfContextData {
  interpreter?: Interpreter;
  giveInput?: (value: number) => void;
}

export const EfContext: React.Context<EfContextData> = React.createContext({});

export const EfContextProvider: React.FC<EfContextProps> = ({ music, metronome, children }) => {
  const [giveInput, setGiveInput] = React.useState<((value: number) => void) | undefined>(undefined);
  const interpreter = React.useMemo(() => {
    return new Interpreter(
      new SparseTape(),
      metronome ?? new WebMetronome(120),
      music,
      {
        getInput() {
          return new Promise(resolve => setGiveInput(value => {
            setGiveInput(undefined);
            resolve(value);
          }));
        },
      },
    );
  }, [music, metronome]);

  React.useEffect(() => {
    return () => {
      interpreter.stop().then(() => interpreter.reset());
    };
  }, [interpreter]);

  const data: EfContextData = { interpreter, giveInput };

  return (
    <EfContext.Provider value={data}>
      {children}
    </EfContext.Provider>
  );
}
