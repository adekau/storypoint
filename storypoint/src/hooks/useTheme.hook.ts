import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';

import { themeState } from '../atoms/theme';

export function useTheme() {
    const theme = useRecoilValue(themeState);

    useEffect(() => {
        const themeRel = document.querySelector('#themeRel');
        themeRel?.setAttribute('href', `css/eui_theme_${theme}.css`);
    }, [theme]);
}