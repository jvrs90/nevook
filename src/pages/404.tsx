import { FC, useContext, useEffect } from 'react';

import Head from '@Components/generic/head';
import { AuthContext } from '@Lib/context/auth.context';
import { fetchWithTimeout } from '@Lib/utils/fetch.utils';

import { RestEndPoints } from '@Enums/paths/rest-endpoints.enum';

const NotFound: FC = () => {
	const { setAuth } = useContext(AuthContext);
	useEffect(() => {
		const loadUser = async () => {
			try {
				const resp = await fetchWithTimeout(
					process.env.NEXT_PUBLIC_SITE_URL + RestEndPoints.PROFILE,
					{
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
						},
					}
				);
				const data = await resp.json();
				data && setAuth(data);
			} catch {}
		};

		loadUser();
	}, []);
	return (
		<>
			<Head title='Página no encontrada | Nevook' noindex />
			<div className='container-sm my-auto px-1'>
				<div className='rounded-1_5 shadow-xl p-1_5 mt-4 bg-white dark:bg-white-dark text-center'>
					<h1 className='text-5xl font-semibold text-primary'>404</h1>
					<p className=' text-white-dark dark:text-white'>
						OOPS... parece que no hay nada aquí
					</p>
				</div>
			</div>
		</>
	);
};


export default NotFound;