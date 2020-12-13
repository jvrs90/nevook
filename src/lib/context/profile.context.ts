import { createContext } from 'react';
import { UserProfileOtherInfo } from '@Interfaces/user/user.interface';
import { ApolloQueryRefetch } from '@Interfaces/apollo/apollo-refetch.types';

interface IProfileContext {
	profile: UserProfileOtherInfo;
	refetch: ApolloQueryRefetch;
}

export const ProfileContext = createContext<IProfileContext>({} as any);
