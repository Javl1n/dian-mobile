import { useMutation } from '@tanstack/react-query';

import { useSession } from '@/context/session';
import http from '@/utils/http';

export interface UserProfile {
  name: string;
  bio: string;
  password?: string | null;
  password_confirmation?: string | null;
  gender: boolean;
  interests: string[];
  birth_date: string;
}

export function useUpdateUserProfileMutation() {
  const { session } = useSession();

  return useMutation({
    mutationFn: (data: UserProfile) =>
      http
        .post('user/update', {
          headers: { Authorization: `Bearer ${session?.token}` },
          json: data,
        })
        .json<{ user: any }>(),
  });
}
