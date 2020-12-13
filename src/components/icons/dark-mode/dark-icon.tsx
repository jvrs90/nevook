import React, { ComponentProps, FC } from 'react';

const DarkIcon: FC<ComponentProps<'svg'>> = props => (
	<svg {...props} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
		<path
			strokeLinecap='round'
			strokeLinejoin='round'
			strokeWidth={2}
			d='M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z'
		/>
	</svg>
);

export default DarkIcon;
