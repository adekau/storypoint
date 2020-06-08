import { Toast } from '@elastic/eui/src/components/toast/global_toast_list';
import { useState } from 'react';
import { useSetRecoilState } from 'recoil';

import { toastsState } from '../atoms/toasts';

type OptionalIdToast = Omit<Toast, 'id'> & Partial<Pick<Toast, 'id'>>;

let toastCounter: number = 0;

export function useGlobalToast() {
    const setToasts = useSetRecoilState(toastsState);
    
    return {
        addConnectionErrorToast: () => {
            setToasts(currentToasts => [
                ...currentToasts,
                {
                    id: (++toastCounter).toString(),
                    title: 'Offline',
                    iconType: 'offline',
                    text: 'Currently unable to connect to the server. Either the server is down or you have lost internet.',
                    color: 'danger'
                }
            ]);
        },

        addConnectionOnlineToast: () => {
            setToasts(currentToasts => [
                ...currentToasts,
                {
                    id: (++toastCounter).toString(),
                    title: 'Online',
                    iconType: 'online',
                    text: 'Connection to the server has been reestablished.',
                    color: 'success'
                }
            ]);
        },

        addToast: (toast: OptionalIdToast) => {
            setToasts(currentToasts => [
                ...currentToasts,
                {
                    ...toast,
                    id: (++toastCounter).toString()
                }
            ]);
        }
    };
}