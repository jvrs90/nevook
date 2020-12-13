import Button from '@Components/generic/form/button/button';
import Input from '@Components/generic/form/input';
import Head from '@Components/generic/head';
import MainLayout from '@Components/layouts/main.layout';
import SocialLogins from '@Components/social/social-logins';
import { AlertMessages, FormMessages } from '@Enums/config/constants';
import { MainPaths } from '@Enums/paths/main-paths.enum';
import { RedirectFrom } from '@Enums/paths/redirect-from.enum';
import { RestEndPoints } from '@Enums/paths/rest-endpoints.enum';
import { RedirectConditions } from '@Enums/redirect-conditions.enum';
import { GSSProps } from '@Interfaces/props/gss-props.interface';
import { IRedirect } from '@Interfaces/redirect.interface';
import { createApolloClient } from '@Lib/apollo/apollo-client';
import { AuthContext } from '@Lib/context/auth.context';
import { withCSRRedirect } from '@Lib/hoc/with-csr-redirect.hoc';
import { getJwtFromCookie } from '@Lib/login/jwt-cookie.utils';
import { fetchWithTimeout } from '@Lib/utils/fetch.utils';
import {
	isRequestSSR,
	loadAuthProps,
	serverRedirect,
} from '@Lib/utils/ssr.utils';
import { getThemeFromCookie } from '@Lib/utils/theme.utils';
import { Form, Formik, FormikConfig, FormikHelpers } from 'formik';
import { decode } from 'jsonwebtoken';
import { FormValidation } from 'nevook-utils';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import { NextRouter, useRouter } from 'next/router';
import { FC, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { object as YupObject, string as YupString } from 'yup';

//#region TS

/**
 * Enum for form field names
 */
enum LoginFields {
	EMAIL = 'email',
	PASSWORD = 'password',
}

/**
 * Interface for form field values
 */
interface ILoginInput {
	email: string;
	password: string;
}

//#endregion

/**
 * Page component to login as user.
 */
const Login: FC = () => {
	const router = useRouter();

	const { loginRequest, loading } = getLoginRequest(router);

	const form = getForm(loginRequest);

	useEffect(() => {
		router.query?.from === RedirectFrom.SOCIAL_LOGIN_ERROR &&
			toast.error(AlertMessages.SOCIAL_LOGIN_ERROR);
	}, []);

	return (
		<>
			<Head
				title='Iniciar sesión | LearnThis'
				description='Inicia sesión en LearnThis'
				url={MainPaths.LOGIN}
			/>
			<MainLayout title='Iniciar sesión'>
				<Formik {...form}>
					<Form>
						<Input
							className='flexcol-s-s mt-0_5'
							name={LoginFields.EMAIL}
							type='email'
							label='Email'
						/>
						<Input
							className='flexcol-s-s mt-0_5'
							name={LoginFields.PASSWORD}
							type='password'
							label='Contraseña'
						/>
						<p className='mt-1'>
							<Link href={MainPaths.FORGOT_PASS}>
								<a className='text-primary'>Olvidé mi contraseña</a>
							</Link>
						</p>
						<Button
							loading={loading}
							className='mt-1'
							type='submit'
							kind='primary'>
							Iniciar sesión
						</Button>
						<p className='mt-1'>
							¿Todavía no tienes cuenta?{' '}
							<Link href={MainPaths.REGISTER}>
								<a className='text-primary'>Regístrate</a>
							</Link>
						</p>
					</Form>
				</Formik>
				<SocialLogins />
			</MainLayout>
		</>
	);
};

/**
 * Gets the REST request to login as user.
 * @param router Next router
 */
const getLoginRequest = (router: NextRouter) => {
	const [loading, setLoading] = useState(false);
	const { setAuth } = useContext(AuthContext);

	const loginRequest = async (body: ILoginInput) => {
		setLoading(true);

		try {
			const response = await fetchWithTimeout(
				process.env.NEXT_PUBLIC_SITE_URL  + RestEndPoints.LOGIN,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(body),
				}
			);

			const responseJson = await response.json();

			if (responseJson.error) {
				toast.error(responseJson.error, { toastId: 1 });
			} else {
				const jwt = responseJson.token;
				const user = responseJson.user;

				setAuth({ jwt, user });

				toast.success(AlertMessages.WELCOME);

				let url: string = MainPaths.INDEX;

				if (Object.keys(router.query).length > 0 && router.query.returnTo)
					url = router.query.returnTo as string;

				router.push(url);
			}
		} catch (error) {
			toast.error(AlertMessages.SERVER_ERROR, { toastId: 1 });
		} finally {
			setLoading(false);
		}
	};

	return { loginRequest, loading };
};

/**
 * Gets the formik data to build the form.
 * @param loginRequest REST request
 */
const getForm = (loginRequest: Function): FormikConfig<ILoginInput> => {
	const initialValues: ILoginInput = {
		[LoginFields.EMAIL]: '',
		[LoginFields.PASSWORD]: '',
	};

	const validationSchema = YupObject().shape({
		[LoginFields.EMAIL]: YupString()
			.test('login.email', FormMessages.EMAIL_ERROR, (value: any) =>
				FormValidation.emailValidation(value || '')
			)
			.required(FormMessages.EMAIL_REQUIRED),
		[LoginFields.PASSWORD]: YupString()
			.test('login.password', FormMessages.PASSWORD_ERROR, (value: any) =>
				FormValidation.passwordValidation(value || '')
			)
			.required(FormMessages.PASSWORD_REQUIRED),
	});

	const onSubmit = async (
		values: ILoginInput,
		helpers: FormikHelpers<ILoginInput>
	) => {
		const body = {
			email: values[LoginFields.EMAIL],
			password: values[LoginFields.PASSWORD],
		};

		await loginRequest(body);

		helpers.setFieldTouched(LoginFields.PASSWORD, false);
		helpers.setFieldValue(LoginFields.PASSWORD, '');
	};

	return {
		initialValues,
		onSubmit,
		validateOnChange: false,
		validationSchema,
	};
};

const redirect: IRedirect = {
	href: MainPaths.INDEX,
	statusCode: 302,
	condition: RedirectConditions.REDIRECT_WHEN_USER_EXISTS,
};

export const getServerSideProps: GetServerSideProps = async (
	ctx: GetServerSidePropsContext
) => {
	const props: GSSProps = { lostAuth: false };
	const isSSR = isRequestSSR(ctx.req.url);

	const jwt = getJwtFromCookie(ctx.req.headers.cookie);

	if (jwt) {
		if (isSSR) {
			const apolloClient = createApolloClient();
			const authProps = await loadAuthProps(ctx.res, jwt, apolloClient);

			if (authProps) serverRedirect(ctx.res, redirect);
		} else if (!decode(jwt)) props.lostAuth = true;
	}

	props.componentProps = {
		shouldRender: !props.authProps,
		theme: getThemeFromCookie(ctx.req.headers.cookie),
	};

	return { props };
};

export default withCSRRedirect(Login, redirect);
