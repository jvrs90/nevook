import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { AuthProps } from '@Interfaces/props/gss-props.interface';
import { UserProfile } from '@Interfaces/user/user.interface';
import { createApolloClient } from '@Lib/apollo/apollo-client';
import { GraphqlUser } from 'nevook-utils';

export const loadCurrentUserSSR = async (
	jwt: string,
	apolloClient: ApolloClient<NormalizedCacheObject>,
	loadEntireUser: boolean = false
): Promise<AuthProps | undefined> => {
	const query = loadEntireUser
		? GraphqlUser.user_profile
		: GraphqlUser.user_profile_min;

	const response = await apolloClient.query({
		query,
		context: {
			headers: { Authorization: `Bearer ${jwt}` },
		},
	});

	const user = response.data.user_profile as UserProfile;

	if (!user) return;

	const {
		email,
		name,
		surname,
		username,
		photo,
	} = user;

	const authProps: AuthProps = {
		user: {
			email,
			name,
			surname,
			username,
			photo,
		},
		jwt,
	};

	return authProps;
};

export const checkActivationToken = async (token: string | string[]) => {
	const apolloClient = createApolloClient();

	try {
		if (typeof token === 'string') {
			const response = await apolloClient.mutate({
				mutation: GraphqlUser.user_activate_account,
				variables: { token },
			});
			if (response?.data?.user_activate_account) return true;
		}
		return false;
	} catch (e) {
		return false;
	}
};

export const checkRecoverToken = async (token: string | string[]) => {
	const apolloClient = createApolloClient();

	try {
		if (typeof token === 'string') {
			const response = await apolloClient.mutate({
				mutation: GraphqlUser.user_valid_forgot_password_token,
				variables: { token },
			});
			if (response?.data?.user_valid_forgot_password_token) return true;
		}
		return false;
	} catch (e) {
		return false;
	}
};
