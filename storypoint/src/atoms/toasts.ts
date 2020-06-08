import { atom } from "recoil";
import { Toast } from "@elastic/eui/src/components/toast/global_toast_list";

export const toastsState = atom<Toast[]>({
    key: 'toasts',
    default: []
});