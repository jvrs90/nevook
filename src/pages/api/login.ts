import { NextApiRequest, NextApiResponse } from 'next';
import { ApolloError } from '@apollo/client';
import { HTTPStatusCodes } from '@Enums/config/http-status-codes.enum';
import { createApolloClient } from '@Lib/apollo/apollo-client';
import { setJwtCookie } from '@Lib/login/jwt-cookie.utils';
import { GraphqlUser } from 'nevook-utils';

const login = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method !== 'POST') {
		res.status(HTTPStatusCodes.METHOD_NOT_ALLOWED).send(false);
		return;
	}

	//TODO Validation email and password
	const { email, password } = req.body;

	const client = createApolloClient();

	try {
		let response = await client.query({
			fetchPolicy: 'network-only',
			query: GraphqlUser.user_login,
			variables: {
				input: {
					email,
					password,
				},
			},
		});

		const token = response.data.user_login.token;
		const user = response.data.user_login.user;

		if (token && user) {
			setJwtCookie(res, token);
			res.status(HTTPStatusCodes.OK).json({ token, user });
		}
	} catch (error: any) {
		if (error instanceof ApolloError && error?.graphQLErrors[0]) {
			res
				.status(error.graphQLErrors[0].extensions?.exception?.status)
				.send({ error: error.message });
		} else {
			res
				.status(HTTPStatusCodes.INTERNAL_SERVER_ERROR)
				.send({ error: 'Error interno del servidor' });
		}
	}
};

export default login;
