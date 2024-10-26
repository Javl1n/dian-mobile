import { useQuery } from '@tanstack/react-query';

import { useSession } from '@/context/session';
import http from '@/utils/http';
import { User } from '@/features/profile/useUserQuery';

export const usePeopleQuery = () => {
     const { session } = useSession();

     return useQuery<Array<User>, Error>({
          queryKey: ['people'],
          queryFn: () =>
               http
                    .get('users', {
                         headers: {
                         Authorization: `Bearer ${session?.token}`,
                         },
                    })
                    .json<Array<User>>(),
          refetchOnReconnect: true,
     });
};

export async function pair({ 
     token, user, action 
}: { 
     token?: string, 
     user: User['id'], 
     action: "follow" | "unfollow"
}): Promise<boolean> {
     try {
       await http
         .post(`user/follow`, {
               headers: { Authorization: `Bearer ${token}` },
               json: {
                    follow: action,
                    person: user
               }
         })
         .json();
       return true;
     } catch (error) {
       // eslint-disable-next-line no-console
       console.error('pairing error', error);
   
       return false;
     }
}