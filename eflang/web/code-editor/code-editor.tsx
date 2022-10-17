import * as EF from '@eflang/ef.lang';
import React  from 'react';
import Editor from "react-simple-code-editor";

export interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
};

const validStyle: React.CSSProperties = {
  color: "green",
  border: "1px solid green",
  borderRadius: "2px",
  background: "rgba(0, 255, 0, 0.2)",
  margin: "-1px",
};
const invalidStyle: React.CSSProperties = { color: "red" };

const notePattern = new RegExp(`^(${EF.NotesInOctave.join("|")})[1-8]$`);

function tokenIsValid(token: string) {
  return token.toUpperCase().match(notePattern) != null || [EF.Rest, EF.LoopStart, EF.LoopEnd].includes(token);
}

function classify(c: string): "whitespace" | "word" {
  if (c.match(/\s+/) != null) {
  	return "whitespace";
  } else {
  	return "word";
  }
}

function highlight(value: string | undefined): React.ReactNode {
	const elements = [];
  let token = "";
  let tokenType: "whitespace" | "word" | null = null;
  
  const pushToken = (style: React.CSSProperties) => {
    elements.push(<span key={elements.length} style={style}>{token}</span>);
  };
  
  for (const c of value ?? "") {
  	if (tokenType !== classify(c)) {
      pushToken(tokenIsValid(token) ? validStyle : invalidStyle);
      token = c;
      tokenType = classify(c);
    } else {
    	token += c;
    }
  }
  
  pushToken({});
  
  return elements;
}

export const CodeEditor = ({ value, onChange }: CodeEditorProps) => {
  return (
    <Editor
      value={value}
      onValueChange={onChange}
      padding={10}
      highlight={highlight}
      style={{
        width: "100%",
        height: "100%",
      }}
    />
  );
}
