export const fetchWithTimeout = (url: RequestInfo, options: RequestInit) => {
	const controller = new AbortController();
	setTimeout(
		() => controller.abort(),
		Number(process.env.NEXT_PUBLIC_REQ_TIMEOUT)
	);

	const fetchOptions = options as any;
	fetchOptions.signal = controller.signal;

	return fetch(url, fetchOptions);
};
