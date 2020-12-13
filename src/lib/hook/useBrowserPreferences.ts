import { BrowserActionsEnum } from '@Enums/config/browser-preferences-actions.enum';
import { ResolutionBreakpoints } from '@Enums/config/resolution-breakpoint.enum';
import { ThemeEnum } from '@Enums/config/theme.enum';
import { ActionMap } from '@Interfaces/reducers/action-map.type';
import { useEffect, useReducer } from 'react';
import { useResolution } from './browserPreferences/useResolution';
import { useToggleDarkMode } from './browserPreferences/useToggleDarkMode';

/**
 * Type's payload browser reducer
 */
type BrowserPayload = {
	[BrowserActionsEnum.SWITCHDARK]: undefined;
	[BrowserActionsEnum.SWITCHRESOLUTION]: {
		newResolution: ResolutionBreakpoints;
		isMobile: boolean;
	};
};

/**
 * Type's actions browser reducer
 */
export type BrowserPreferencesActions = ActionMap<BrowserPayload>[keyof ActionMap<BrowserPayload>];

/**
 * Interface for browser preferences state.
 */
export interface IBrowserPreferencesState {
	theme: ThemeEnum;
	resolution: ResolutionBreakpoints;
	isMobile: boolean;
}

const reducer = (
	oldState: IBrowserPreferencesState,
	action: BrowserPreferencesActions
): IBrowserPreferencesState => {
	switch (action.type) {
		case BrowserActionsEnum.SWITCHDARK:
			return {
				...oldState,
				theme:
					oldState.theme === ThemeEnum.DARK ? ThemeEnum.LIGHT : ThemeEnum.DARK,
			};
		case BrowserActionsEnum.SWITCHRESOLUTION:
			return {
				...oldState,
				resolution: action.payload.newResolution,
				isMobile: action.payload.isMobile,
			};
		default:
			return oldState;
	}
};

export const useBrowserPreferences = (initialTheme: ThemeEnum) => {
	/**
	 * Initial values, necessary for correct hydration of the DOM after SSR.
	 */
	const [browserPreferences, setBrowserPreferences] = useReducer(reducer, {
		theme: initialTheme,
		resolution: ResolutionBreakpoints.XS,
		isMobile: true,
	});

	const handleResize = useResolution(browserPreferences, setBrowserPreferences);
	const toggleDarkMode = useToggleDarkMode(
		browserPreferences,
		setBrowserPreferences
	);

	// Sets the true screen resolution, after the component has been mounted.
	useEffect(() => {
		handleResize();
	}, []);

	return { browserPreferences, toggleDarkMode };
};
