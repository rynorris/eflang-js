import React from 'react';
import { CodeEditor } from '@eflang/web.code-editor';
import { EfContextProvider } from '@eflang/web.ef-context';
import { Instruction, Note } from '@eflang/ef.lang';
import { ArraySource } from '@eflang/ef.array-source';
import { Controls } from './components/controls';
import { Plugins } from './components/plugins';

const parse: (music: string) => Instruction[] = music => music.split(/\s/).map(str => {
    if (str === "r" || str === "(" || str === ")") {
        return str;
    }

    return { note: str[0]?.toUpperCase() as Note["note"], octave: parseInt(str[1]) as Note["octave"] };
});

export function App() {
  const [music, setMusic] = React.useState("");

  const source = React.useMemo(() => {
    return new ArraySource(parse(music));
  }, [music]);

  return (
    <div>
      <CodeEditor value={music} onChange={setMusic} />
      <EfContextProvider music={source}>
        <Plugins />
        <Controls />
      </EfContextProvider>
    </div>
  );
}
