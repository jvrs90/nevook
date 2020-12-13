import { Env } from '@Enums/config/env.enum';
import cookie from 'cookie';
import { ServerResponse } from 'http';

const JWT_COOKIE_NAME = 'jid'; //TODO Move to env

export const getJwtFromCookie = (cookies?: string): string | void => {
	if (cookies) {
		return cookie.parse(cookies)[JWT_COOKIE_NAME];
	}
};

export const setJwtCookie = (res: ServerResponse, token: string) => {
	const jwtCookie = cookie.serialize(JWT_COOKIE_NAME, token, {
		httpOnly: true,
		path: '/',
		secure: process.env[Env.SECURE_COOKIE] !== 'false',
		sameSite: 'lax',
		maxAge: Number(process.env[Env.COOKIE_EXPIRATION]),
	});

	res.setHeader('Set-Cookie', jwtCookie);
};

export const removeJwtCookie = (res: ServerResponse) => {
	const jwtCookie = cookie.serialize(JWT_COOKIE_NAME, '', {
		httpOnly: true,
		path: '/',
		secure: process.env[Env.SECURE_COOKIE] !== 'false',
		sameSite: 'lax',
		maxAge: 0,
	});

	res.setHeader('Set-Cookie', jwtCookie);
};
