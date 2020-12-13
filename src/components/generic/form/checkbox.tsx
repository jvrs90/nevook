import { CheckIcon } from '@Icons/generic/check-icon';
import { Field, FieldHookConfig, useField } from 'formik';
import { FC } from 'react';

/**
 * Formik's custom input checkbox with text component.
 *
 * @param props.className Additional classname
 * @param props.name Input form name
 * @param props.children Elements associated to checkbox
 */
const CheckBox: FC<FieldHookConfig<string>> = ({
	className = '',
	children,
	name,
}) => {
	const [field, meta] = useField(name);

	const error = meta.touched && meta.error;

	return (
		<label className={`flex-s-c ${className}`}>
			<div
				className={`border-2 rounded w-1 h-1 xssm:h-1_25 xssm:w-1_25 flex-c-c mr-0_75 cursor-pointer ${
					error
						? 'border-red'
						: 'border-primary focus:border-primary-hover focus:border-2'
				}`}>
				<Field
					className='opacity-0 absolute cursor-pointer checkbox'
					type='checkbox'
					checked={field.value}
					{...field}
				/>
				<CheckIcon className='fill-current hidden w-0_75 h-0_75 xssm:h-1 xssm:w-1 text-primary pointer-events-none checked:block' />
			</div>
			{children}
		</label>
	);
};

export default CheckBox;
