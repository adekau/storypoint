import { useState } from 'react';
import { useSetRecoilState } from 'recoil';

import { toastsState } from '../atoms/toasts';

export function useGlobalToast() {
    const [toastCounter, setToastCounter] = useState(0);
    const setToasts = useSetRecoilState(toastsState);
    
    return {
        addConnectionErrorToast: () => {
            setToasts(currentToasts => [
                ...currentToasts,
                {
                    id: toastCounter.toString(),
                    title: 'Offline',
                    iconType: 'offline',
                    text: 'Currently unable to connect to the server. Either the server is down or you have lost internet.',
                    color: 'danger'
                }
            ]);
            setToastCounter(count => count + 1);
        },

        addConnectionOnlineToast: () => {
            setToasts(currentToasts => [
                ...currentToasts,
                {
                    id: toastCounter.toString(),
                    title: 'Online',
                    iconType: 'online',
                    text: 'Connection to the server has been reestablished.',
                    color: 'success'
                }
            ]);
            setToastCounter(count => count + 1);
        }
    };
}