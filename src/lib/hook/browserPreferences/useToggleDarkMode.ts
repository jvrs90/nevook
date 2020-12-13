import { BrowserActionsEnum } from '@Enums/config/browser-preferences-actions.enum';
import { ThemeEnum } from '@Enums/config/theme.enum';
import cookie from 'cookie';
import { Dispatch, useCallback } from 'react';
import {
	BrowserPreferencesActions,
	IBrowserPreferencesState,
} from '../useBrowserPreferences';

export const useToggleDarkMode = (
	browserPreferences: IBrowserPreferencesState,
	setBrowserPreferences: Dispatch<BrowserPreferencesActions>
) => {
	const toggleDarkMode = useCallback(() => {
		document.querySelector('html')?.classList.toggle(ThemeEnum.DARK);
		document.querySelector('html')?.classList.toggle(ThemeEnum.LIGHT);
		if (browserPreferences.theme === ThemeEnum.LIGHT) {
			document.cookie = cookie.serialize(
				process.env.NEXT_PUBLIC_THEME_COOKIE_NAME || 'theme',
				ThemeEnum.DARK,
				{
					path: '/',
				}
			);
		} else {
			document.cookie = cookie.serialize(
				process.env.NEXT_PUBLIC_THEME_COOKIE_NAME || 'theme',
				ThemeEnum.LIGHT,
				{
					path: '/',
				}
			);
		}
		setBrowserPreferences({ type: BrowserActionsEnum.SWITCHDARK });
	}, [browserPreferences.theme]);

	return toggleDarkMode;
};
