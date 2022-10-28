import React from "react";
import { EfContext } from "@eflang/web.ef-context";

export function useInterpreterControls() {
    const ctx = React.useContext(EfContext);
    const interpreter = ctx.interpreter!;

    const play = React.useCallback(() => {
        interpreter.perform();
    }, [interpreter]);

    const pause = React.useCallback(() => {
        (async () => {
            await interpreter.pause();
        })();
    }, [interpreter]);

    const unpause = React.useCallback(() => {
        (async () => {
            await interpreter.unpause();
        })();
    }, [interpreter]);

    const stop = React.useCallback(() => {
        (async () => {
            await interpreter.stop();
            interpreter.reset();
        })();
    }, [interpreter]);

    return {play, pause, unpause, stop};
}
