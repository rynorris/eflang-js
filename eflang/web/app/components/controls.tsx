import React from "react";
import { useInterpreterControls } from "@eflang/web.hooks.use-interpreter-controls";

export const Controls = () => {
    const { play, pause, unpause, stop } = useInterpreterControls();
    return (
        <div>
            <button onClick={play}>Play</button>
            <button onClick={pause}>Pause</button>
            <button onClick={unpause}>Unpause</button>
            <button onClick={stop}>Stop</button>
        </div>
    )
};