import { ComponentProps, FC } from 'react';

export const CheckIcon: FC<ComponentProps<'svg'>> = props => (
	<svg {...props} viewBox='0 0 20 20'>
		<path d='M0 11l2-2 5 5L18 3l2 2L7 18z' />
	</svg>
);
