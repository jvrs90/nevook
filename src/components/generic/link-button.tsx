import { FC } from 'react';
import Link, { LinkProps } from 'next/link';
import { ButtonType, ButtonTypes } from '@Enums/generic/button-types.enum';

export interface LinkButtonProps extends LinkProps {
	className?: string;
	kind: ButtonType;
}

const LinkButton: FC<LinkButtonProps> = ({
	children,
	kind,
	className,
	...props
}) => {
	const classNames = ['px-1', 'py-0_5', 'rounded-md'];

	const styles = {
		[ButtonTypes.PRIMARY]: [
			'text-white',
			'bg-primary',
			'hover:bg-primary-hover',
		],
		[ButtonTypes.CTA]: ['text-white', 'bg-cta', 'hover:bg-cta-hover'],
	};

	classNames.push(...styles[kind]);

	className && classNames.push(className);

	className = classNames.join(' ');

	return (
		<Link {...props}>
			<a className={className}>{children}</a>
		</Link>
	);
};

export default LinkButton;
