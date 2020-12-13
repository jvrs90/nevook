import { Env } from '@Enums/config/env.enum';
import { LoginStrategies } from '@Enums/config/login-strategies.enum';
import { MainPaths } from '@Enums/paths/main-paths.enum';
import { ProfilePaths } from '@Enums/paths/profile-paths.enum';
import { RedirectFrom } from '@Enums/paths/redirect-from.enum';
import { createApolloClient } from '@Lib/apollo/apollo-client';
import CryptoJS from 'crypto-js';
import { GraphqlUser } from 'nevook-utils';
import { NextApiResponse } from 'next';
import { getJwtFromCookie, setJwtCookie } from './jwt-cookie.utils';

export const getState = (returnTo: string): string => {
	const stateObject = returnTo ? { returnTo, link: false } : { link: false };

	return Buffer.from(JSON.stringify(stateObject)).toString('base64');
};

export const callbackStrategy = (
	accessToken: string,
	_refreshToken: string,
	_profile: any,
	done: Function
) => done(undefined, accessToken);

export const handlerRedirect = (
	req: any,
	res: NextApiResponse,
	strategy: LoginStrategies
) => (error: Error, user: any) => {
	if (!error) {
		req.user = user;
		callbackRedirect(strategy.toUpperCase())(req, res);
	} else {
		const { state } = req.query;
		const stateParsed = JSON.parse(
			Buffer.from(state.toString(), 'base64').toString()
		);
		if (stateParsed.link)
			res.redirect(
				`${ProfilePaths.ACCOUNTS}?from=${RedirectFrom.SOCIAL_LOGIN_ERROR}`
			);
		else
			res.redirect(
				`${MainPaths.LOGIN}?from=${RedirectFrom.SOCIAL_LOGIN_ERROR}`
			);
	}
};

const callbackRedirect = (type: string) => async (
	req: any,
	res: NextApiResponse
) => {
	if (req.user) {
		const { state } = req.query;
		const stateParsed = JSON.parse(Buffer.from(state, 'base64').toString());

		const apolloClient = createApolloClient();

		const key = CryptoJS.enc.Base64.parse(process.env[Env.AES_KEY] as string);
		const iv = CryptoJS.enc.Base64.parse(process.env[Env.AES_IV] as string);

		const encrypted = CryptoJS.AES.encrypt(req.user, key, {
			iv,
		}).toString();

		if (!stateParsed.link) {
			try {
				const responseMutation = await apolloClient.mutate({
					mutation: GraphqlUser.user_social_login,
					variables: {
						input: {
							token: encrypted,
							type,
						},
					},
				});
				const { token } = responseMutation.data.user_social_login;

				let returnTo = MainPaths.INDEX;

				returnTo =
					stateParsed && stateParsed.returnTo
						? stateParsed.returnTo
						: MainPaths.INDEX;

				setJwtCookie(res, token);
				res.redirect(`${returnTo}`);
			} catch (error) {
				console.log(error);
				res.redirect(
					`${MainPaths.LOGIN}?from=${RedirectFrom.SOCIAL_LOGIN_ERROR}`
				);
			}
		} else {
			try {
				const { cookie } = req.headers;
				const jwt = getJwtFromCookie(cookie);

				await apolloClient.mutate({
					mutation: GraphqlUser.user_link_social_profile,
					variables: {
						input: {
							token: encrypted,
							type,
						},
					},
					context: { headers: { Authorization: `Bearer ${jwt}` } },
				});

				res.redirect(ProfilePaths.ACCOUNTS);
			} catch (error) {
				console.log(error);
				res.redirect(
					`${ProfilePaths.ACCOUNTS}?from=${RedirectFrom.SOCIAL_LOGIN_ERROR}`
				);
			}
		}
	} else {
		res.redirect(`${MainPaths.LOGIN}?from=${RedirectFrom.SOCIAL_LOGIN_ERROR}`);
	}
};
