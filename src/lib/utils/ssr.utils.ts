import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { AuthProps } from '@Interfaces/props/gss-props.interface';
import { IRedirect } from '@Interfaces/redirect.interface';
import { removeJwtCookie } from '@Lib/login/jwt-cookie.utils';
import { ServerResponse } from 'http';
import { generateQueryParams } from './url.utils';
import { loadCurrentUserSSR } from './user.utils';

export const isRequestSSR = (currentUrl?: string) => {
	if (!currentUrl) return true;
	const extension = currentUrl.split('?').shift()?.split('.').pop();
	return !extension || extension !== 'json';
};

export const serverRedirect = (
	res: ServerResponse,
	{ href, statusCode, query }: IRedirect
) => {
	let queryString;

	if (query) queryString = generateQueryParams(query);

	const url = queryString ? `${href}?${queryString}` : href;

	res.setHeader('Location', url);
	res.statusCode = statusCode;
	res.end();
};

export const loadAuthProps = async (
	res: ServerResponse,
	jwt: string,
	apolloClient: ApolloClient<NormalizedCacheObject>,
	loadEntireUser?: boolean
): Promise<AuthProps | undefined> => {
	try {
		return await loadCurrentUserSSR(jwt, apolloClient, loadEntireUser);
	} catch (error) {
		removeJwtCookie(res);
	}
};
