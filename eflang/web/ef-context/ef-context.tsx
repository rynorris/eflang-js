import { MusicSource } from '@eflang/ef.interpreter-api';
import { SparseTape } from '@eflang/ef.sparse-tape';
import { Interpreter } from '@eflang/ef.interpreter';
import React from 'react';
import { WebMetronome } from '@eflang/web.web-metronome';

export type EfContextProps = {
  music: MusicSource;
  children?: React.ReactNode;
};

interface EfContextData {
  interpreter?: Interpreter;
  giveInput?: (value: number) => void;
  onOutput?: (listener: (value: number) => void) => void;
}

export const EfContext: React.Context<EfContextData> = React.createContext({});

export const EfContextProvider: React.FC<EfContextProps> = ({ music, children }) => {
  const [giveInput, setGiveInput] = React.useState<((value: number) => void) | undefined>(undefined);
  const interpreter = React.useMemo(() => {
    return new Interpreter(
      new SparseTape(),
      new WebMetronome(120),
      music,
      {
        getInput() {
          return new Promise(resolve => setGiveInput(resolve));
        },
      },
    );
  }, [music]);

  return (
    <div>
      {children}
    </div>
  );
}
