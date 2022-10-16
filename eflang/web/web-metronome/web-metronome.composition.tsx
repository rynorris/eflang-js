import React from "react";
import { WebMetronome } from "./web-metronome";

export const Ticker = () => {
    const [count, setCount] = React.useState(0);
    const metronome = React.useMemo(() => new WebMetronome(100), []);
    React.useEffect(() => {
        (async () => {
            while (true) {
                setCount(c => c + 1);
                await metronome.next(null, 2);
            }
        })();
    }, [metronome]);

    return <div>{count}</div>;
};