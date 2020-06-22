import { Themes } from '../types/themes';

export default function setTheme(theme: Themes): void {
    const themeRel = document.querySelector('#themeRel');
    themeRel?.setAttribute('href', `css/eui_theme_${theme}.css`);
}