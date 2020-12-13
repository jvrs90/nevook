import { ApolloError, useMutation } from '@apollo/client';
import Button from '@Components/generic/form/button/button';
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
import { object as YupObject, string as YupString } from 'yup';

//#region TS

/**
 * Enum for form field names
 */
enum ForgotPassFields {
	EMAIL = 'email',
}

/**
 * Interface for form field values
 */
interface IForgotPass {
	[ForgotPassFields.EMAIL]: string;
}

//#endregion

/**
 * Page component to generate a recover password token.
 */
const ForgotPass: FC = () => {
	const { forgotPassMutation, loading } = getForgotPassMutation();

	const form = getForm(forgotPassMutation);

	return (
		<>
			<Head
				title='Recuperar contraseña | LearnThis'
				description='Recupera tu contraseña de LearnThis'
				url={MainPaths.FORGOT_PASS}
			/>
			<MainLayout title='Recuperar contraseña'>
				<Formik {...form}>
					<Form>
						<Input
							label='Email'
							className='flexcol-s-s mt-0_5'
							type='email'
							name={ForgotPassFields.EMAIL}
						/>

						<p className='mt-1'>
							¿Recuerdas tu contraseña?{' '}
							<Link href={MainPaths.LOGIN}>
								<a className='text-primary'>Inicia sesión</a>
							</Link>
						</p>
						<Button
							loading={loading}
							className='mt-1'
							type='submit'
							kind='primary'>
							Recuperar
						</Button>
					</Form>
				</Formik>
			</MainLayout>
		</>
	);
};

/**
 * Gets the graphql mutation to generate a new recover password token, and send it by email.
 */
const getForgotPassMutation = () => {
	const router = useRouter();

	const [forgotPassMutation, { loading }] = useMutation(
		GraphqlUser.user_create_forgot_password_token,
		{
			onCompleted: () => {
				toast.success(AlertMessages.FORGOT_PASS_SENT);
				router.push(MainPaths.INDEX);
			},
			onError: (error: ApolloError) => {
				toast.error(error.message || AlertMessages.SERVER_ERROR);
			},
		}
	);

	return { forgotPassMutation, loading };
};

/**
 * Gets the formik data to build the form.
 * @param forgotPassMutation Graphql mutation
 */
const getForm = (
	forgotPassMutation: ApolloMutation
): FormikConfig<IForgotPass> => {
	const initialValues: IForgotPass = {
		[ForgotPassFields.EMAIL]: '',
	};

	const validationSchema = YupObject().shape({
		[ForgotPassFields.EMAIL]: YupString()
			.test('forgot-password.email', FormMessages.EMAIL_ERROR, (value: any) =>
				FormValidation.emailValidation(value || '')
			)
			.required(FormMessages.EMAIL_REQUIRED),
	});

	const onSubmit = (values: IForgotPass) => {
		forgotPassMutation({
			variables: { email: values[ForgotPassFields.EMAIL] },
		});
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

export default withCSRRedirect(ForgotPass, redirect);
