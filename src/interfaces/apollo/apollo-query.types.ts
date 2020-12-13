import {
	FetchResult,
	MutationFunctionOptions,
	QueryLazyOptions,
} from '@apollo/client';

export type ApolloMutation = (
	options?: MutationFunctionOptions<any, Record<string, any>> | undefined
) => Promise<FetchResult<any, Record<string, any>, Record<string, any>>>;

export type ApolloLazyQuery = (
	options?: QueryLazyOptions<Record<string, any>> | undefined
) => void;