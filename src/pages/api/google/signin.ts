import nextConnect from 'next-connect';
import passport from 'passport';

import { LoginStrategies } from '@Enums/config/login-strategies.enum';

import { gStrategy } from '@Lib/login/google';
import { getState } from '@Lib/login/utils';

const signin = nextConnect();

passport.use(gStrategy);

signin.use(passport.initialize());

signin.get((req: any, res, next) => {
	const state = getState(req.query.returnTo);

	const authenticator = passport.authenticate(LoginStrategies.GOOGLE, {
		session: false,
		state,
	});
	authenticator(req, res, next);
});

export default signin;
