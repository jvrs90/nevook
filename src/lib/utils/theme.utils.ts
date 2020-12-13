import { ThemeEnum } from '@Enums/config/theme.enum';
import cookie from 'cookie';

export const getThemeFromCookie = (cookies?: string): string | void => {
	if (cookies) {
		return (
			cookie.parse(cookies)[
				process.env.NEXT_PUBLIC_THEME_COOKIE_NAME || 'theme'
			] || ThemeEnum.LIGHT
		);
	} else {
		return ThemeEnum.LIGHT;
	}
};
