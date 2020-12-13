import { FC } from 'react';


export type MainLayoutProps = {
	title: string;
};

const MainLayout: FC<MainLayoutProps> = ({ title, children }) => (
	<div className='container-sm my-auto px-1'>
		<div className='rounded-1_5 shadow-xl p-1_5 my-4 bg-white dark:bg-white-dark text-white-dark dark:text-white'>
			<div className='flex-c-s'>
				<div className='xssm:hidden mdlg:w-1/4 flex-c-c'>
                    ICONO LOGO
				</div>
				<div className='xssm:w-full mdlg:w-3/4 flex-c-c'>
					<div className='w-full max-w-20 py-1_5 xssm:text-center'>
						<h1 className='ml-1 text-primary text-2xl font-semibold mb-1'>
							{title}
						</h1>
						{children}
					</div>
				</div>
			</div>
		</div>
	</div>
);

export default MainLayout;
