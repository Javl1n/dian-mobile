import { useMutation } from '@tanstack/react-query';

import { useSession } from '@/context/session';
import http from '@/utils/http';

export interface UploadPost {
     text_content: string;
     profile: boolean;
}

export function useUploadPostMutation() {
     const {session} = useSession();

     return useMutation({
          mutationFn: (data: UploadPost) =>
               http
                    .post('post', {
                         headers: { Authorization: `Bearer ${session?.token}` },
                         json: data
                    })
                    .json(),
     });
}