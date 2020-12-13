import { LoginStrategies } from '@Enums/config/login-strategies.enum';
import { handlerRedirect } from '@Lib/login/utils';
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import passport from 'passport';

const redirect = nextConnect();

redirect.get<NextApiRequest, NextApiResponse>((req, res, next) => {
	const authenticator = passport.authenticate(
		LoginStrategies.GOOGLE,
		{
			session: false,
		},
		handlerRedirect(req, res, LoginStrategies.GOOGLE)
	);
	authenticator(req, res, next);
});

export default redirect;
