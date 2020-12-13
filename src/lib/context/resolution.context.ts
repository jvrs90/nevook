import { IBrowserPreferencesState } from '@Lib/hook/useBrowserPreferences';
import { createContext } from 'react';

interface IBrowserContext {
	browserPreferences: IBrowserPreferencesState;
	toggleDarkMode: () => void;
}

export const BrowserContext = createContext<IBrowserContext>({} as any);