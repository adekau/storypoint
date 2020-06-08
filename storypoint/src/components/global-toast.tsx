import { EuiGlobalToastList } from '@elastic/eui';
import React from 'react';

export default function GlobalToast() {
    return (
        <EuiGlobalToastList
            toasts={
                [{ id: 'd', title: 'Unable to Connect', color: 'danger', iconType: 'help' }]
            }
            toastLifeTimeMs={6000}
            dismissToast={() => { }} />
    );
}