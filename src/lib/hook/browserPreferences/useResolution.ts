import { ResolutionBreakpointValues } from '@Config/resolution.settings';
import { BrowserActionsEnum } from '@Enums/config/browser-preferences-actions.enum';
import { ResolutionBreakpoints } from '@Enums/config/resolution-breakpoint.enum';
import { Dispatch, useCallback, useEffect } from 'react';
import {
	BrowserPreferencesActions,
	IBrowserPreferencesState,
} from '../useBrowserPreferences';

/**
 * Interface for resolution state.
 */
interface IResolutionState {
	resolution: ResolutionBreakpoints;
	isMobile: boolean;
}

/**
 * Gets the current screen resolution from the window size.
 */
const getResolution = (): IResolutionState => {
	const innerWidth = window.innerWidth;

	let resolution = ResolutionBreakpoints.LG;
	let isMobile = false;

	if (innerWidth <= ResolutionBreakpointValues.XS) {
		resolution = ResolutionBreakpoints.XS;
		isMobile = true;
	} else if (innerWidth <= ResolutionBreakpointValues.SM) {
		resolution = ResolutionBreakpoints.SM;
		isMobile = true;
	} else if (innerWidth <= ResolutionBreakpointValues.MD) {
		resolution = ResolutionBreakpoints.MD;
		isMobile = false;
	}

	return { resolution, isMobile };
};

/**
 * Hook to handle screen resolution state and its associated side effects.
 */
export const useResolution = (
	browserPreferences: IBrowserPreferencesState,
	setBrowserPreferences: Dispatch<BrowserPreferencesActions>
): (() => void) => {
	const handleResize = useCallback(() => {
		const newResolutionState = getResolution();
		if (newResolutionState.resolution !== browserPreferences.resolution) {
			setBrowserPreferences({
				type: BrowserActionsEnum.SWITCHRESOLUTION,
				payload: {
					newResolution: newResolutionState.resolution,
					isMobile: newResolutionState.isMobile,
				},
			});
		}
	}, [browserPreferences.resolution]);

	// Handles the window resize events that can modify the resolution state.
	useEffect(() => {
		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, [browserPreferences.resolution]);

	return handleResize;
};
