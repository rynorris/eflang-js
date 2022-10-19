import { ArraySource } from "@eflang/ef.array-source";
import { Instruction, Note } from "@eflang/ef.lang";
import { SparseTape } from "@eflang/ef.sparse-tape";
import React from "react";
import { RawIO } from "@eflang/web.raw-io";
import { SynthPerformer } from "@eflang/web.synth-performer";
import { WebMetronome } from "@eflang/web.web-metronome";
import { Interpreter } from "./interpreter";

const FIBONACCI_STRING = `c4 b3 c4 c4 r e4 e4 r c4
( g4 ( c5 e4 e4 g4 g4 a4 a4 f4 c4 )
e4 a4 c5 f4
( f4 e4 d4 c4 d4 d4 f4 g4 c5 f4 )
e4 d4 c4
( c4 f4 a4 a4 f4 c4 ) d4 e4 r c4 )
`;

const FIBONACCI: Instruction[] = FIBONACCI_STRING.split(/\s/).map(str => {
    if (str === "r" || str === "(" || str === ")") {
        return str;
    }

    return { note: str[0]?.toUpperCase() as Note["note"], octave: parseInt(str[1]) as Note["octave"] };
});

const buttonStyle: React.CSSProperties = {
    background: "white",
    borderRadius: "3px",
    border: "2px solid gray",
    cursor: "pointer",
    padding: "5px",
    margin: "5px",
    minWidth: "80px",
};

export const SimpleProgram = () => {
    const interpreter = React.useMemo(() => {
        return new Interpreter(
            new SparseTape(),
            new SynthPerformer(),
            new WebMetronome(100),
            new ArraySource(FIBONACCI),
            new RawIO(),
        );
    }, []);

    const [state, setState] = React.useState<"idle" | "playing" | "paused">("idle");

    const startPlaying = React.useCallback(() => {
        interpreter.perform();
        setState("playing");
    }, [interpreter]);

    const pause = React.useCallback(() => {
        (async () => {
            await interpreter.pause();
            setState("paused");
        })();
    }, [interpreter]);

    const unpause = React.useCallback(() => {
        (async () => {
            await interpreter.unpause();
            setState("playing");
        })();
    }, [interpreter]);

    const stop = React.useCallback(() => {
        (async () => {
            await interpreter.stop();
            interpreter.reset();
            setState("idle");
        })();
    }, [interpreter]);

    const playPause = React.useCallback(() => {
        if (state === "idle") {
            startPlaying();
        } else if (state === "playing") {
            pause();
        } else if (state === "paused") {
            unpause();
        }
    }, [state, startPlaying, pause, unpause]);

    return (
        <>
            <div style={{ whiteSpace: "pre" }}>{FIBONACCI_STRING}</div>
            <div style={{ display: "flex", flexDirection: "row" }}>
                <button style={buttonStyle} onClick={playPause}>{state === "playing" ? "Pause" : "Play"}</button>
                <button style={buttonStyle} onClick={stop} disabled={state === "idle"}>Stop</button>
            </div>
        </>
    );
};