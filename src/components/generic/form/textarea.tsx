import { Field, FieldHookConfig, useField } from 'formik';
import { FC } from 'react';

export interface TextAreaProps {
	label: string;
	className?: string;
}

/**
 * Formik's custom textarea component.
 *
 * @param props.label HTML label text
 * @param props.className Additional classname
 * @param props.placeholder Input placeholder
 * @param props Other HTML input props
 */
const TextArea: FC<TextAreaProps & FieldHookConfig<string>> = ({
	label,
	className,
	placeholder,
	...props
}) => {
	const [field, meta] = useField(props);

	const error = meta.touched && meta.error;

	return (
		<label className={className}>
			<span className='mb-0_25 ml-0_5 text-white-dark dark:text-white'>
				{label}
			</span>
			<Field
				as='textarea'
				className={`resize-none overflow-y-auto w-full h-full px-0_75 py-0_75 rounded-lg border  bg-secondary dark:bg-gray-900 text-white-dark dark:text-white ${
					error
						? 'border-red'
						: 'border-primary focus:border-primary-hover focus:border-2'
				}`}
				placeholder={placeholder || label}
				{...field}
				{...props}></Field>
			{error && <p className='text-red text-sm ml-1'>{meta.error}</p>}
		</label>
	);
};

export default TextArea;
