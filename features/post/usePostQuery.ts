import { useQuery } from '@tanstack/react-query';

import { useSession } from '@/context/session';
import http from '@/utils/http';
import { User } from '@/features/profile/useUserQuery';


export interface Post {
     id: string;
     user: User;
     content: string;
     profile: boolean;
     created_at: string;
     updated_at: string;
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
export const usePostsQuery = () => {
     const { session } = useSession();

     return useQuery<Array<Post>, Error>({
          queryKey: ['posts'],
          queryFn: () =>
               http
                    .get('posts', {
                         headers: {
                         Authorization: `Bearer ${session?.token}`,
                         },
                    })
                    .json<Array<Post>>(),
          refetchOnReconnect: true,
     });
};
