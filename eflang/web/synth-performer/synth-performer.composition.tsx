import { note, Note } from "@eflang/ef.lang";
import React from "react";
import { SynthPerformer } from "./synth-performer";

const C_SCALE: Note[] = [
    note("C", 4),
    note("D", 4),
    note("E", 4),
    note("F", 4),
    note("G", 4),
    note("A", 4),
    note("B", 4),
    note("C", 5),
];

export const Scale = () => {
    const [noteIx, setNoteIx] = React.useState(0);

    React.useEffect(() => {
        const timeout = setInterval(() => setNoteIx(ix => (ix + 1) % C_SCALE.length), 1000);
        return () => clearInterval(timeout);
    }, []);

    const performer = React.useMemo(() => new SynthPerformer(), []);

    React.useEffect(() => {
        performer.play(C_SCALE[noteIx]);
    }, [performer, noteIx]);

    return <div>{C_SCALE[noteIx].note}</div>;
};