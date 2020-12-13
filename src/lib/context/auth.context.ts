import { AuthState } from '@Interfaces/states/browser-context.interface';
import { createContext, Dispatch, SetStateAction } from 'react';

interface IAuthContext {
	stateAuth: AuthState;
	setAuth: Dispatch<SetStateAction<AuthState>>;
}

export const AuthContext = createContext<IAuthContext>({} as any);
