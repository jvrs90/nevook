import { ComponentProps, FC } from 'react';
import { ButtonType, ButtonTypes } from '@Enums/generic/button-types.enum';
import Loader from '@Components/loader';

export interface ButtonProps extends ComponentProps<'button'> {
	kind: ButtonType;
	loading?: boolean;
}

/**
 * Custom button element with predefined stypes for each button kind.
 *
 * @param props.kind Button predefined kind
 * @param props.loading When true, render loader instead of button
 * @param props.classname Additional className
 * @param props.children Child elements
 * @param props.props Other button props
 *
 */
const Button: FC<ButtonProps> = ({
	kind,
	loading,
	className,
	children,
	...props
}) => {
	const buttonStyles = {
		[ButtonTypes.PRIMARY]: 'text-white bg-primary hover:bg-primary-hover',
		[ButtonTypes.CTA]: 'text-white bg-cta hover:bg-cta-hover',
	};

	if (loading) return <Loader />;

	return (
		<button
			className={`${buttonStyles[kind]} ${className} px-1 py-0_5 rounded-md disabled:bg-gray-600 disabled:cursor-default`}
			{...props}>
			{children}
		</button>
	);
};

export default Button;
