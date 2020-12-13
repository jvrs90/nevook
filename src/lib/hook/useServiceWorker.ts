import { useEffect } from 'react';

let isLoaded = false;
export const useServiceWorker = (path: string) => {
	useEffect(() => {
		if (!window || isLoaded) return;
		isLoaded = true;
		let hasNewUpdate = false;
		if ('serviceWorker' in navigator) {
			navigator.serviceWorker.addEventListener('controllerchange', function (
				_e
			) {
				if (!hasNewUpdate) return;
				window.location.reload();
			});
			navigator.serviceWorker
				.register(path)
				.then(registration => {
					console.log('Service Worker Registered');
					if (registration.waiting) {
						hasNewUpdate = true;
						registration.waiting.postMessage({
							updateSw: true,
						});
					}
					if (registration.active) {
						registration.addEventListener('updatefound', () => {
							console.log('Update found. Waiting for install to complete.');
							const installingWorker = registration.installing;
							const appStartUpdateEvent = new CustomEvent('appStartUpdate', {
								detail: installingWorker,
							});
							window.dispatchEvent(appStartUpdateEvent);
							installingWorker &&
								installingWorker.addEventListener('statechange', () => {
									if (installingWorker.state === 'installed') {
										const appUpdateEvent = new CustomEvent('appUpdate', {
											detail: installingWorker,
										});
										hasNewUpdate = true;
										window.dispatchEvent(appUpdateEvent);
									}
								});
						});
					}
				})
				.catch(e => console.log(e));
		}

		window.addEventListener('beforeinstallprompt', function (e) {
			e.preventDefault();
			const appInstallEvent = new CustomEvent('appInstall', {
				detail: e,
			});
			window.dispatchEvent(appInstallEvent);
			return false;
		});
	}, []);
};