import { useEffect } from 'react';
import { useRecoilState } from 'recoil';

import { onlineState } from '../atoms/online';
import { useGlobalToast } from './global-toast.hook';

export function useConnectionWatcher(): boolean {
    const [online, setOnline] = useRecoilState(onlineState);
    const { addLocalNetOfflineToast, addLocalNetOnlineToast } = useGlobalToast();

    useEffect(
        () => {
            const online = () => {
                setOnline(true);
                addLocalNetOnlineToast();
            };
            const offline = () => {
                setOnline(false);
                addLocalNetOfflineToast();
            };

            window.addEventListener('online', online);
            window.addEventListener('offline', offline);

            return () => {
                window.removeEventListener('online', online);
                window.removeEventListener('offline', offline);
            };
        },
        [
            online,
            setOnline,
            addLocalNetOfflineToast,
            addLocalNetOnlineToast
        ]
    );

    return online;
}