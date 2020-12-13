import { ComponentProps, FC } from 'react';

export const RightArrowIcon: FC<ComponentProps<'svg'>> = props => (
	<svg {...props} viewBox='0 0 512 512'>
		<path d='M80 272h319.2L277 388.4c-6.4 6.1-6.6 16.2-.6 22.6 6.1 6.4 16.2 6.6 22.6.6l139.6-133c6-6.1 9.4-14.1 9.4-22.6s-3.3-16.6-9.7-22.9L299 100.4c-3-2.8-6.9-4.4-11-4.4-4.2 0-8.4 1.7-11.6 5-6.1 6.4-5.8 16.5.6 22.6L399.7 240H80c-8.8 0-16 7.2-16 16s7.2 16 16 16z' />
	</svg>
);
