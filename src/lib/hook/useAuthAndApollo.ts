import { NormalizedCacheObject } from '@apollo/client';
import { AuthProps } from '@Interfaces/props/gss-props.interface';
import { AuthState } from '@Interfaces/states/browser-context.interface';
import { initializeApollo } from '@Lib/apollo/apollo-client';
import { useEffect, useState } from 'react';

/**
 * Hook to handle the auth state and its Apollo client, as well as associated side effects.
 * @param authProps
 * @param lostAuth
 * @param apolloCache
 */
export const useAuthAndApollo = (
	authProps?: AuthProps,
	lostAuth?: boolean,
	apolloCache?: NormalizedCacheObject
) => {
	const [stateAuth, setAuth] = useState<AuthState>({
		user: authProps?.user,
		jwt: authProps?.jwt,
	});

	const apolloClient = initializeApollo(stateAuth?.jwt, lostAuth, apolloCache);

	// Create a new Apollo client after logout.
	useEffect(() => {
		if (!stateAuth) initializeApollo(undefined, true);
	}, [stateAuth]);

	return { apolloClient, setAuth, stateAuth };
};