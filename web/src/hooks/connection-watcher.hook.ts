import { useCallback, useEffect } from 'react';
import { useSetRecoilState } from 'recoil';

import { onlineState } from '../atoms/online';
import { useGlobalToast } from './global-toast.hook';

export function useConnectionWatcher(): void {
    const setOnline = useSetRecoilState(onlineState);
    const { addLocalNetOfflineToast, addLocalNetOnlineToast } = useGlobalToast();

    const offlineFn = useCallback(
        () => {
            setOnline(false);
            addLocalNetOfflineToast();
        },
        [setOnline, addLocalNetOfflineToast]
    );

    const onlineFn = useCallback(
        () => {
            setOnline(true);
            addLocalNetOnlineToast();
        },
        [setOnline, addLocalNetOnlineToast]
    );

    useEffect(
        () => {
            window.addEventListener('online', onlineFn);
            window.addEventListener('offline', offlineFn);

            return () => {
                window.removeEventListener('online', onlineFn);
                window.removeEventListener('offline', offlineFn);
            };
        },
        [
            onlineFn,
            offlineFn,
            setOnline,
            addLocalNetOfflineToast,
            addLocalNetOnlineToast
        ]
    );
}