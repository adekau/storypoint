import { Toast } from '@elastic/eui/src/components/toast/global_toast_list';
import { useSetRecoilState } from 'recoil';

import { toastsState } from '../atoms/toasts';

type OptionalIdToast = Omit<Toast, 'id'> & Partial<Pick<Toast, 'id'>>;

let toastCounter: number = 0;

export function useGlobalToast() {
    const setToasts = useSetRecoilState(toastsState);
    
    return {
        addServerConnectionErrorToast: () => {
            setToasts(currentToasts => [
                ...currentToasts,
                {
                    id: (++toastCounter).toString(),
                    title: 'Server Offline',
                    iconType: 'offline',
                    text: 'Currently unable to connect to the server. Either the server is down or you have lost internet.',
                    color: 'danger'
                }
            ]);
        },

        addServerConnectedToast: () => {
            setToasts(currentToasts => [
                ...currentToasts,
                {
                    id: (++toastCounter).toString(),
                    title: 'Server Online',
                    iconType: 'online',
                    text: 'Connection to the server has been reestablished.',
                    color: 'success'
                }
            ]);
        },

        addLocalNetOfflineToast: () => {
            setToasts(currentToasts => [
                ...currentToasts,
                {
                    id: (++toastCounter).toString(),
                    title: 'Internet Disconnected',
                    iconType: 'offline',
                    text: 'Your internet connection has been lost.',
                    color: 'danger'
                }
            ]);
        },

        addLocalNetOnlineToast: () => {
            setToasts(currentToasts => [
                ...currentToasts,
                {
                    id: (++toastCounter).toString(),
                    title: 'Internet Connected',
                    iconType: 'online',
                    text: 'Your internet connection has been restored.',
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