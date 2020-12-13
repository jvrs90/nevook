import { ApolloError, useMutation } from '@apollo/client';
import Button from '@Components/generic/form/button/button';
import InputDate from '@Components/generic/form/date-picker/input-date';
import ImageDragDrop from '@Components/generic/form/Image-drag-drop';
import Input from '@Components/generic/form/input';
import Select from '@Components/generic/form/select/select';
import SelectItem from '@Components/generic/form/select/select-item';
import TextArea from '@Components/generic/form/textarea';
import { AlertMessages, FormMessages } from '@Enums/config/constants';
import { Gender } from '@Enums/generic/gender.enum';
import { ProfilePaths } from '@Enums/paths/profile-paths.enum';
import { ApolloMutation } from '@Interfaces/apollo/apollo-query.types';
import { ApolloQueryRefetch } from '@Interfaces/apollo/apollo-refetch.types';
import { AuthState } from '@Interfaces/states/browser-context.interface';
import {
	UserProfile,
	UserProfileOtherInfo,
} from '@Interfaces/user/user.interface';
import { AuthContext } from '@Lib/context/auth.context';
import { ProfileContext } from '@Lib/context/profile.context';
import { parseDate_US_ES } from '@Lib/utils/date.utils';
import { Form, Formik, FormikConfig } from 'formik';
import { FormValidation, GraphqlUser } from 'nevook-utils';
import { useRouter } from 'next/router';
import { Dispatch, FC, SetStateAction, useContext } from 'react';
import { toast } from 'react-toastify';
import { object as YupObject, string as YupString } from 'yup';

//#region TS

/**
 * Enum for form field names
 */
enum ProfileDataFields {
	NAME = 'name',
	SURNAME = 'surname',
	GENDER = 'gender',
	BIRTHDATE = 'birthDate',
	BIO = 'bio',
}

/**
 * Interface for form field values
 */
interface IProfileDataInput {
	[ProfileDataFields.NAME]: string;
	[ProfileDataFields.SURNAME]: string;
	[ProfileDataFields.GENDER]: Gender | string;
	[ProfileDataFields.BIRTHDATE]: string;
	[ProfileDataFields.BIO]: string;
}

//#endregion

/**
 * Component to edit user profile data.
 */
const ProfileData: FC = () => {
	const { profile, refetch } = useContext(ProfileContext);
	const { stateAuth, setAuth } = useContext(AuthContext);

	const { modifyProfileMutation, loading } = getModifyProfileMutation(
		refetch,
		setAuth
	);

	const form = getForm(profile, modifyProfileMutation, stateAuth);

	const dateNow = new Date();
	const maxDate = new Date(
		dateNow.getFullYear() - 13,
		dateNow.getMonth(),
		dateNow.getDate()
	);

	return (
		<>
			<div className='flex-c-c w-10 h-10 overflow-hidden mx-auto rounded-full'>
				<ImageDragDrop
					name='photo'
					url={process.env.NEXT_PUBLIC_BACK_API_URI + '/user/upload'}
					ratio={1}
					current={stateAuth.user?.photo}
					rounded
					onChange={url => {
						setAuth({
							...stateAuth,
							user: {
								...((stateAuth.user || {}) as UserProfile),
								photo: url,
							},
						});
					}}
				/>
			</div>
			<Formik {...form}>
				<Form className='flex-s-s flex-wrap relative xssm:mt-0'>
					<Input
						className='flexcol-s-s mt-1 mdlg:w-1/2 mdlg:pl-0_75 mdlg:pr-0_75 xssm:w-full box-border'
						name={ProfileDataFields.NAME}
						type='text'
						label='Nombre'
					/>
					<Input
						className='flexcol-s-s mt-1 mdlg:w-1/2 mdlg:pl-0_75 mdlg:pr-0_75 xssm:w-full box-border'
						name={ProfileDataFields.SURNAME}
						type='text'
						label='Apellidos'
					/>
					<Select
						className='flexcol-s-s mt-1 mdlg:w-1/2 mdlg:pl-0_75 mdlg:pr-0_75 xssm:w-full box-border'
						label='Género'
						placeholder='Seleccione un valor...'
						name={ProfileDataFields.GENDER}>
						<SelectItem value={Gender.MALE}>Hombre</SelectItem>
						<SelectItem value={Gender.FEMALE}>Mujer</SelectItem>
						<SelectItem value={Gender.OTHER_GENDER}>Otro género</SelectItem>
						<SelectItem value={Gender.RATHER_NOT_SAY}>
							Prefiero no decirlo
						</SelectItem>
					</Select>
					<InputDate
						className='flexcol-s-s mt-1 mdlg:w-1/2 mdlg:pl-0_75 mdlg:pr-0_75 xssm:w-full box-border'
						label='Fecha de nacimiento'
						placeholder='Seleccione su fecha de nacimiento...'
						name={ProfileDataFields.BIRTHDATE}
						defaultDate={maxDate}
						maxDate={maxDate}
						minDate={new Date(1900, 0, 1)}
					/>
					<TextArea
						className='flexcol-s-s mt-1 mdlg:px-0_75 h-10 w-full box-border'
						name={ProfileDataFields.BIO}
						label='Biografía'
						placeholder='Cuenta algo sobre ti...'
					/>
					<div className='flex-c-s w-full'>
						<Button
							loading={loading}
							className='mt-1_5'
							type='submit'
							kind='primary'>
							Guardar cambios
						</Button>
					</div>
				</Form>
			</Formik>
		</>
	);
};

/**
 * Gets the graphql mutation to modify user's profile.
 *
 * @param refetch Refetch profile query
 * @param setAuth SetState for auth
 */
const getModifyProfileMutation = (
	refetch: ApolloQueryRefetch,
	setAuth: Dispatch<SetStateAction<AuthState>>
) => {
	const router = useRouter();

	const [modifyProfileMutation, { loading }] = useMutation(
		GraphqlUser.user_modify_profile,
		{
			onCompleted: ({ user_modify_profile: response }) => {
				toast.success(AlertMessages.MODIFY_PROFILE_SUCCESS);
				setAuth(
					(oldState: AuthState): AuthState => {
						if (
							oldState.user?.name !== response.name ||
							oldState.user?.surname !== response.surname
						) {
							return {
								...oldState,
								user: {
									...oldState.user,
									name: response.name,
									surname: response.surname,
								},
							} as AuthState;
						}

						return oldState;
					}
				);
				refetch();
				router.push(ProfilePaths.SUMMARY);
			},
			onError: (error: ApolloError) => {
				toast.error(error.message || AlertMessages.SERVER_ERROR);
			},
		}
	);

	return { modifyProfileMutation, loading };
};

/**
 * Gets the formik data to build the form.
 * @param profile User's profile data
 * @param modifyProfileMutation Graphql mutation
 * @param stateAuth Auth state
 */
const getForm = (
	profile: UserProfileOtherInfo,
	modifyProfileMutation: ApolloMutation,
	stateAuth: AuthState
): FormikConfig<IProfileDataInput> => {
	const initialValues: IProfileDataInput = {
		[ProfileDataFields.NAME]: stateAuth.user?.name || '',
		[ProfileDataFields.SURNAME]: stateAuth.user?.surname || '',
		[ProfileDataFields.GENDER]: profile.gender || '',
		[ProfileDataFields.BIRTHDATE]: profile.birthDate || '',
		[ProfileDataFields.BIO]: profile.bio || '',
	};

	const validationSchema = YupObject().shape({
		[ProfileDataFields.NAME]: YupString()
			.test('profile-data.name', FormMessages.NAME_ERROR, value =>
				FormValidation.nameValidation(value || '')
			)
			.required(FormMessages.NAME_REQUIRED),
		[ProfileDataFields.SURNAME]: YupString()
			.test('profile-data.surname', FormMessages.SURNAME_ERROR, value =>
				FormValidation.nameValidation(value || '')
			)
			.required(FormMessages.SURNAME_REQUIRED),
		[ProfileDataFields.GENDER]: YupString()
			.oneOf(Object.keys(Gender))
			.nullable(),
		[ProfileDataFields.BIRTHDATE]: YupString().test(
			'profile-data.birthdate',
			FormMessages.BIRTHDATE_ERROR,
			(value: any) => {
				return value
					? FormValidation.birthDateValidation(new Date(parseDate_US_ES(value)))
					: true;
			}
		),
		[ProfileDataFields.BIO]: YupString().test(
			'modify.bio',
			FormMessages.BIO_ERROR,
			(value: any) => (value ? FormValidation.bioValidation(value || '') : true)
		),
	});

	const onSubmit = async (values: IProfileDataInput) => {
		const input: Partial<IProfileDataInput> = {};

		for (const key in values) {
			// @ts-ignore
			if (values[key] !== initialValues[key])
				// @ts-ignore
				input[key] = values[key];
		}

		if (!Object.keys(input).length)
			toast.error(AlertMessages.NOTHING_TO_MODIFY);
		else modifyProfileMutation({ variables: { input } });
	};

	return {
		initialValues,
		validationSchema,
		onSubmit,
		validateOnChange: false,
	};
};

export default ProfileData;
