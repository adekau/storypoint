import { useEffect, useMemo, useState } from 'react';

import { createWebSocketPromise } from '../helpers/web-socket-promise';

export function useWebSocketIsConnecting(ws: WebSocket) {
    const [connecting, setConnecting] = useState(true);
    const [error, setError] = useState(null);
    const wsPromise = useMemo(() => createWebSocketPromise(ws), [ws]);
    
    useEffect(
        () => {
            let canSetState = true;
            setConnecting(true);
            setError(null);
            wsPromise
                .then(() => {
                    if (canSetState)
                        setConnecting(false);
                })
                .catch((e) => {
                    if (canSetState)
                        setError(e);
                })
            return () => {
                canSetState = false;
            };
        },
        [setConnecting, setError, wsPromise]
    );

    return { connecting, error };
}