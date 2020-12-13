import { ApolloError, useMutation } from '@apollo/client';
import Button from '@Components/generic/form/button/button';
import Input from '@Components/generic/form/input';
import Loader from '@Components/loader';
import SocialAccounts from '@Components/social/social-accounts';
import { AlertMessages, FormMessages } from '@Enums/config/constants';
import { RedirectFrom } from '@Enums/paths/redirect-from.enum';
import { ApolloMutation } from '@Interfaces/apollo/apollo-query.types';
import { AuthState } from '@Interfaces/states/browser-context.interface';
import { AuthContext } from '@Lib/context/auth.context';
import { Form, Formik, FormikConfig } from 'formik';
import { FormValidation, GraphqlStudent } from 'nevook-utils';
import { useRouter } from 'next/router';
import { Dispatch, FC, SetStateAction, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import { object as YupObject, string as YupString } from 'yup';

//#region TS
enum ProfileAccountsFields {
	EMAIL = 'email',
	USERNAME = 'username',
}

interface IProfileAccountEmail {
	[ProfileAccountsFields.EMAIL]: string;
}

interface IProfileAccountUsername {
	[ProfileAccountsFields.USERNAME]: string;
}

//#endregion

/**
 * Component to edit user's email, username and social media accounts.
 */
const ProfileAccounts: FC = () => {
	const router = useRouter();
	const { stateAuth, setAuth } = useContext(AuthContext);

	const { modifyEmailMutation, loadingEmail } = getModifyEmailMutation(setAuth);
	const { modifyUsernameMutation, loadingUsername } = getModifyUsernameMutation(
		setAuth
	);

	const emailForm = getEmailForm(stateAuth, modifyEmailMutation);
	const usernameForm = getUsernameForm(stateAuth, modifyUsernameMutation);

	//Error from social link
	useEffect(() => {
		router.query?.from === RedirectFrom.SOCIAL_LOGIN_ERROR &&
			toast.error(AlertMessages.SOCIAL_LOGIN_ERROR);
	}, []);

	return (
		<div className='flex-s-s flex-wrap relative xssm:mt-0'>
			<Formik
				{...emailForm}
				render={({ values }) => (
					<Form className='flex-c-s w-full flex-wrap relative xssm:mt-0'>
						<Input
							className='flexcol-s-s mt-1 mdlg:w-1/2 mdlg:pl-0_75 mdlg:pr-0_75 xssm:w-full box-border'
							name={ProfileAccountsFields.EMAIL}
							type='email'
							label='Email'
						/>
						<div className='flex-c-s w-full'>
							<Button
								loading={loadingEmail}
								className='mt-1_5'
								type='submit'
								kind='primary'
								disabled={
									values[ProfileAccountsFields.EMAIL] ===
									stateAuth.user?.email
								}>
								Guardar correo
							</Button>
						</div>
					</Form>
				)}
			/>
			<Formik
				{...usernameForm}
				render={({ values }) => (
					<Form className='flex-c-s w-full flex-wrap relative xssm:mt-0'>
						<Input
							className='flexcol-s-s mt-1 mdlg:w-1/2 mdlg:pl-0_75 mdlg:pr-0_75 xssm:w-full box-border'
							name={ProfileAccountsFields.USERNAME}
							type='text'
							label='Nombre de usuario'
						/>
						<div className='flex-c-s w-full'>
							{loadingUsername ? (
								<Loader />
							) : (
								<Button
									className='mt-1_5'
									type='submit'
									kind='primary'
									disabled={
										values[ProfileAccountsFields.USERNAME] ===
											stateAuth.user?.username ||
										values[ProfileAccountsFields.USERNAME] === ''
									}>
									Guardar nombre de usuario
								</Button>
							)}
						</div>
					</Form>
				)}
			/>

			<div className='w-full'>
				<SocialAccounts />
			</div>
		</div>
	);
};

/**
 * Gets the graphql mutation to modify user's email.
 * @param setAuth SetState for auth
 */
const getModifyEmailMutation = (
	setAuth: Dispatch<SetStateAction<AuthState>>
) => {
	const [modifyEmailMutation, { loading }] = useMutation(
		GraphqlStudent.user_change_email,
		{
			onCompleted: ({ user_change_email: newEmail }) => {
				setAuth(
					(oldState: AuthState): AuthState => {
						if (oldState.user?.email !== newEmail)
							return {
								...oldState,
								user: {
									...oldState.user,
									email: newEmail,
								},
							} as AuthState;
						return oldState;
					}
				);
				toast.success(AlertMessages.MODIFY_EMAIL_SUCCESS);
			},
			onError: (error: ApolloError) => {
				toast.error(error.message || AlertMessages.SERVER_ERROR);
			},
		}
	);

	return { modifyEmailMutation, loadingEmail: loading };
};

/**
 * Gets the formik data to build the email's form.
 * @param stateAuth Auth state
 * @param modifyEmailMutation Graphql mutation
 */
const getEmailForm = (
	stateAuth: AuthState,
	modifyEmailMutation: ApolloMutation
): FormikConfig<IProfileAccountEmail> => {
	const initialValues: IProfileAccountEmail = {
		[ProfileAccountsFields.EMAIL]: stateAuth.user?.email || '',
	};

	const validationSchema = YupObject().shape({
		[ProfileAccountsFields.EMAIL]: YupString()
			.test('profile-accounts.email', FormMessages.EMAIL_ERROR, (value: any) =>
				FormValidation.emailValidation(value || '')
			)
			.required(FormMessages.EMAIL_REQUIRED),
	});

	const onSubmit = (values: IProfileAccountEmail) => {
		modifyEmailMutation({
			variables: { newEmail: values[ProfileAccountsFields.EMAIL] },
		});
	};

	return {
		initialValues,
		onSubmit,
		validateOnChange: false,
		validationSchema,
	};
};

/**
 * Gets the graphql mutation to modify user's username.
 * @param setAuth SetState for auth
 */
const getModifyUsernameMutation = (
	setAuth: Dispatch<SetStateAction<AuthState>>
) => {
	const [modifyUsernameMutation, { loading }] = useMutation(
		GraphqlStudent.user_change_username,
		{
			onCompleted: ({ user_change_username: newUsername }) => {
				setAuth(
					(oldState: AuthState): AuthState => {
						if (oldState.user?.username !== newUsername)
							return {
								...oldState,
								user: {
									...oldState.user,
									username: newUsername,
								},
							} as AuthState;

						return oldState;
					}
				);
				toast.success(AlertMessages.MODIFY_USERNAME_SUCCESS);
			},
			onError: (error: ApolloError) => {
				toast.error(error.message || AlertMessages.SERVER_ERROR);
			},
		}
	);

	return { modifyUsernameMutation, loadingUsername: loading };
};

/**
 * Gets the formik data to build the username's form.
 * @param stateAuth Auth state
 * @param modifyUsernameMutation Graphql mutation
 */
const getUsernameForm = (
	stateAuth: AuthState,
	modifyUsernameMutation: ApolloMutation
): FormikConfig<IProfileAccountUsername> => {
	const initialValues: IProfileAccountUsername = {
		[ProfileAccountsFields.USERNAME]: stateAuth.user?.username || '',
	};

	const validationSchema = YupObject().shape({
		[ProfileAccountsFields.USERNAME]: YupString()
			.test(
				'profile-accounts.username',
				FormMessages.USERNAME_ERROR,
				(value: any) => FormValidation.usernameValidation(value || '')
			)
			.nullable(),
	});

	const onSubmit = (values: IProfileAccountUsername) => {
		modifyUsernameMutation({
			variables: { newUsername: values[ProfileAccountsFields.USERNAME] },
		});
	};

	return {
		initialValues,
		onSubmit,
		validateOnChange: false,
		validationSchema,
	};
};

export default ProfileAccounts;
