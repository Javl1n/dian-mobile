import { useQuery } from '@tanstack/react-query';

import { useSession } from '@/context/session';
import http from '@/utils/http';
import { User } from '@/features/profile/useUserQuery';

export interface Room {
     id: number;
     code: string;
     participants: Participant[];
     messages: ChatMessage[];
     latest_message: ChatMessage;
     created_at: string;
     updated_at: string;
}

export interface Participant {
     id: number;
     room: Room;
     user: User;
}

export interface ChatMessage {
     id: number;
     room: Room;
     user: User;
     content: string;
     created_at: string;
     updated_at: string;
}

export const useRoomsQuery = () => {
     const { session } = useSession();

     return useQuery<Array<Room>, Error>({
          queryKey: ['rooms'],
          queryFn: () =>
               http
                    .get('rooms', {
                         headers: {
                              Authorization: `Bearer ${session?.token}`,
                         },
                    })
                    .json<Array<Room>>(),
          refetchOnReconnect: true,
     });
};

export const useRoomQuery = ({ roomId }: { roomId: string }) => {
     const { session } = useSession();

     return useQuery<Room, Error>({
          queryKey: ['room'],
          queryFn: () =>
               http
                    .get(`room/${roomId}`, {
                         headers: {
                              Authorization: `Bearer ${session?.token}`,
                         },
                    })
                    .json<Room>(),
          refetchOnReconnect: true,
     })
}