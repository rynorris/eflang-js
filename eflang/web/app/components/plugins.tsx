import React from "react";
import { ConsoleOutput } from "@eflang/web.console-output";
import { SynthPerformer } from "@eflang/web.synth-performer"
import { useInterpreterPlugin } from "@eflang/web.hooks.use-interpreter-plugin";

export const Plugins = () => {
    const audio = React.useMemo(SynthPerformer, []);
    const console = React.useMemo(ConsoleOutput, []);
    useInterpreterPlugin(audio);
    useInterpreterPlugin(console);
    return null;
};