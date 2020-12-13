import { RestEndPoints } from '@Enums/paths/rest-endpoints.enum';
import { Strategy } from 'passport-google-oauth20';
import { callbackStrategy } from './utils';

export const gStrategy = new Strategy(
	{
		clientID: process.env.GOOGLE_CLIENT_ID || '',
		clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
		callbackURL:
			process.env.NEXT_PUBLIC_SITE_URL + RestEndPoints.GOOGLE_REDIRECT,
		scope: ['profile', 'email'],
	},
	callbackStrategy
);