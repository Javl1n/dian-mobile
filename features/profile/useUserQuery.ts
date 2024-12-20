import { useQuery } from '@tanstack/react-query';

import { useSession } from '@/context/session';
import http from '@/utils/http';

export interface User {
  id: number;
  name: string;
  bio: string | null;
  username?: string;
  email: string;
  birthdate?: string;
  gender?: boolean;
  created_at: string;
  updated_at: string;
  followers: Match[];
  following: Match[];
}

export interface Match {
  id: number;
  follower_id: number;
  following_id: number;
  status: number;
}

export interface Interest {
  id: number;
  name: string;
}

export interface EditInterest {
  my_interests: string[];
  all_interests: string[];
}

/**
 * Custom hook to fetch and cache user data.
 *
 * The User data is set to stay in cache indefinitely (staleTime: Infinity) because:
 * 1. User information rarely changes during a session.
 * 2. It reduces unnecessary network requests, improving performance.
 * 3. It ensures consistent user data across the app without frequent refetches.
 * 4. Any updates to user data should be manually invalidated after successful mutations.
 */
export const useUserQuery = () => {
  const { session } = useSession();

  return useQuery<User, Error>({
    queryKey: ['user'],
    queryFn: () =>
      http
        .get('user', {
          headers: {
            Authorization: `Bearer ${session?.token}`,
          },
        })
        .json<User>(),
    staleTime: Infinity,
  });
};

export const useEditInterestQuery = () => {
  const { session } = useSession();
  return useQuery<EditInterest, Error>({
    queryKey: ['interests'],
    queryFn: () =>
      http
        .get('profile/interests', {
          headers: {
            Authorization: `Bearer ${session?.token}`,
          },
        })
        .json<EditInterest>(),
    staleTime: Infinity,
  })
};

export const useAuthUserQuery = ({token}: {token: string}) => {
  
  return useQuery<User, Error>({
    queryKey: ['user'],
    queryFn: () =>
      http
        .get('user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .json<User>(),
    staleTime: Infinity,
  });
};
