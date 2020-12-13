import { ApolloQueryResult } from '@apollo/client';

export type ApolloQueryRefetch = (
	variables?: Partial<any> | undefined
) => Promise<ApolloQueryResult<any>>;
