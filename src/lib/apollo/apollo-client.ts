import {
	ApolloClient,
	ApolloLink,
	InMemoryCache,
	NormalizedCacheObject,
} from '@apollo/client';
import { BatchHttpLink } from '@apollo/client/link/batch-http';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';

let globalApolloClient: ApolloClient<NormalizedCacheObject>;
let globalJwt: string | undefined;

export const createApolloClient = (jwt?: string) => {
	const authLink = setContext((_, { headers }) => {
		return jwt
			? {
					headers: {
						...headers,
						Authorization: `Bearer ${jwt}`,
					},
			  }
			: { ...headers };
	});

	const errorLink = onError(({ graphQLErrors, networkError }) => {
		if (graphQLErrors)
			graphQLErrors.map(({ message, locations, path }) =>
				console.log(
					`[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(
						locations
					)}, Path: ${path}`
				)
			);
		if (networkError) console.log(`[Network error]: ${networkError}`);
	});

	const batchLink = new BatchHttpLink({
		uri: process.env.NEXT_PUBLIC_GQL_URI,
		batchInterval: 30,
	});

	return new ApolloClient<NormalizedCacheObject>({
		ssrMode: typeof window === 'undefined',
		link: ApolloLink.from([errorLink, authLink, batchLink]),
		cache: new InMemoryCache({
			addTypename: false,
		}),
	});
};

export function initializeApollo(
	jwt?: string,
	lostAuth?: boolean,
	initialState?: NormalizedCacheObject
) {
	let _apolloClient: ApolloClient<NormalizedCacheObject> = globalApolloClient;

	//If apolloClient not exists previously or an auth change happen
	if (!globalApolloClient || (jwt !== undefined && jwt !== globalJwt)) {
		_apolloClient = createApolloClient(jwt);
		globalJwt = jwt;
	}
	//If client lost his auth state or client logout
	else if (lostAuth || !jwt) {
		_apolloClient = createApolloClient();
		globalJwt = undefined;
	}

	if (initialState) {
		const existingCache = _apolloClient.extract();
		_apolloClient.cache.restore({
			...existingCache,
			...initialState,
		} as any);
	}

	globalApolloClient = _apolloClient;
	return _apolloClient;
}
