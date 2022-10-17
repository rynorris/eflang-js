import React from 'react';
import { CodeEditor } from './code-editor';

export const BasicCodeEditor = () => {
  const [code, setCode] = React.useState("");

  return (
    <div style={{ width: 200, height: 100 }}>
      <CodeEditor value={code} onChange={setCode} />
    </div>
  );
}
