import { ApolloError, useMutation } from '@apollo/client';
import Button from '@Components/generic/form/button/button';
import CheckBox from '@Components/generic/form/checkbox';
import Input from '@Components/generic/form/input';
import Head from '@Components/generic/head';
import MainLayout from '@Components/layouts/main.layout';
import { AlertMessages, FormMessages } from '@Enums/config/constants';
import { MainPaths } from '@Enums/paths/main-paths.enum';
import { RedirectConditions } from '@Enums/redirect-conditions.enum';
import { ApolloMutation } from '@Interfaces/apollo/apollo-query.types';
import { GSSProps } from '@Interfaces/props/gss-props.interface';
import { IRedirect } from '@Interfaces/redirect.interface';
import { createApolloClient } from '@Lib/apollo/apollo-client';
import { withCSRRedirect } from '@Lib/hoc/with-csr-redirect.hoc';
import { getJwtFromCookie } from '@Lib/login/jwt-cookie.utils';
import {
	isRequestSSR,
	loadAuthProps,
	serverRedirect,
} from '@Lib/utils/ssr.utils';
import { getThemeFromCookie } from '@Lib/utils/theme.utils';
import { Form, Formik, FormikConfig } from 'formik';
import { decode } from 'jsonwebtoken';
import { FormValidation, GraphqlUser } from 'nevook-utils';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC } from 'react';
import { toast } from 'react-toastify';
import {
	bool as YupBool,
	object as YupObject,
	ref as YupRef,
	string as YupString,
} from 'yup';

//#region TS

/**
 * Enum for form field names
 */
enum RegisterFields {
	EMAIL = 'user_email',
	PASSWORD = 'user_password',
	CONFIRM_PASSWORD = 'user_conf_pass',
	NAME = 'user_name',
	SURNAME = 'user_surname',
	PRIVACITY = 'privacity',
}

/**
 * Interface for form field values
 */
interface IRegisterInput {
	user_email: string;
	user_password: string;
	user_conf_pass: string;
	user_name: string;
	user_surname: string;
	privacity: boolean;
}

//#endregion

/**
 * Page component to register a new user.
 */
const Register: FC = () => {
	const { registerMutation, loading } = getRegisterMutation();

	const form = getForm(registerMutation);

	return (
		<>
			<Head
				title='Registro | LearnThis'
				description='Regístrate en LearnThis'
				url={MainPaths.REGISTER}
			/>
			<MainLayout title='Registro'>
				<Formik {...form}>
					<Form>
						<Input
							className='flexcol-s-s mt-0_5'
							name={RegisterFields.NAME}
							type='text'
							label='Nombre'
						/>
						<Input
							className='flexcol-s-s mt-0_5'
							name={RegisterFields.SURNAME}
							type='text'
							label='Apellidos'
						/>
						<Input
							className='flexcol-s-s mt-0_5'
							name={RegisterFields.EMAIL}
							type='email'
							label='Email'
						/>
						<Input
							className='flexcol-s-s mt-0_5'
							name={RegisterFields.PASSWORD}
							type='password'
							label='Contraseña'
						/>
						<Input
							className='flexcol-s-s mt-0_5'
							name={RegisterFields.CONFIRM_PASSWORD}
							type='password'
							label='Confirmar contraseña'
						/>
						<CheckBox className='mt-1' name={RegisterFields.PRIVACITY}>
							<p className='text-left'>
								He leído y acepto la
								<a
									href={MainPaths.PRIVACY_POLICY}
									target='_blank'
									className='text-primary'>
									{' '}
									política de privacidad
								</a>
							</p>
						</CheckBox>
						<p className='mt-1'>
							¿Ya tienes cuenta?{' '}
							<Link href={MainPaths.LOGIN}>
								<a className='text-primary'>Iniciar sesión</a>
							</Link>
						</p>
						<Button
							loading={loading}
							className='mt-1'
							type='submit'
							kind='primary'>
							Regístrate
						</Button>
					</Form>
				</Formik>
			</MainLayout>
		</>
	);
};

/**
 * Gets the graphql mutation to register a new user.
 */
const getRegisterMutation = () => {
	const router = useRouter();

	const [registerMutation, { loading }] = useMutation(
		GraphqlUser.user_register,
		{
			onCompleted: () => {
				toast.success(AlertMessages.REGISTER_SUCCESS);
				router.push(MainPaths.INDEX);
			},
			onError: (error: ApolloError) => {
				toast.error(error.message || AlertMessages.SERVER_ERROR);
			},
		}
	);

	return { registerMutation, loading };
};

/**
 * Gets the formik data to build the form.
 * @param registerMutation Graphql mutation
 */
const getForm = (
	registerMutation: ApolloMutation
): FormikConfig<IRegisterInput> => {
	const initialValues: IRegisterInput = {
		[RegisterFields.NAME]: '',
		[RegisterFields.SURNAME]: '',
		[RegisterFields.EMAIL]: '',
		[RegisterFields.PASSWORD]: '',
		[RegisterFields.CONFIRM_PASSWORD]: '',
		[RegisterFields.PRIVACITY]: false,
	};

	const validationSchema = YupObject().shape({
		[RegisterFields.NAME]: YupString()
			.test('register.name', FormMessages.NAME_ERROR, value =>
				FormValidation.nameValidation(value || '')
			)
			.required(FormMessages.NAME_REQUIRED),
		[RegisterFields.SURNAME]: YupString()
			.test('register.surname', FormMessages.SURNAME_ERROR, value =>
				FormValidation.nameValidation(value || '')
			)
			.required(FormMessages.SURNAME_REQUIRED),
		[RegisterFields.EMAIL]: YupString()
			.test('register.email', FormMessages.EMAIL_ERROR, (value: any) =>
				FormValidation.emailValidation(value || '')
			)
			.required(FormMessages.EMAIL_REQUIRED),
		[RegisterFields.PASSWORD]: YupString()
			.test('register.password', FormMessages.PASSWORD_ERROR, (value: any) =>
				FormValidation.passwordValidation(value || '')
			)
			.required(FormMessages.PASSWORD_REQUIRED),
		[RegisterFields.CONFIRM_PASSWORD]: YupString()
			.oneOf([YupRef(RegisterFields.PASSWORD)], FormMessages.PASSWORD_CHECK)
			.required(FormMessages.CONFIRM_PASSWORD_REQUIRED),
		[RegisterFields.PRIVACITY]: YupBool().oneOf([true]),
	});

	const onSubmit = (values: IRegisterInput) => {
		registerMutation({
			variables: {
				input: {
					email: values[RegisterFields.EMAIL],
					password: values[RegisterFields.PASSWORD],
					name: values[RegisterFields.NAME],
					surname: values[RegisterFields.SURNAME],
				},
			},
		});
	};

	return {
		initialValues,
		onSubmit,
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

export default withCSRRedirect(Register, redirect);
