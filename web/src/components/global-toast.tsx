import { EuiGlobalToastList } from '@elastic/eui';
import { Toast } from '@elastic/eui/src/components/toast/global_toast_list';
import React from 'react';
import { useRecoilState } from 'recoil';

import { toastsState } from '../atoms/toasts';

export default function GlobalToast() {
    const [toasts, setToasts] = useRecoilState(toastsState);

    const removeToast = (toast: Toast) => setToasts(toasts.filter(t => t.id !== toast.id));

    return (
        <EuiGlobalToastList
            toasts={toasts}
            toastLifeTimeMs={5000}
            dismissToast={removeToast}
        />
    );
}