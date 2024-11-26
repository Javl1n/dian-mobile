import { useSession } from "@/context/session";
import http from "@/utils/http";
import { useMutation } from "@tanstack/react-query";

export interface PostMessage {
     text_content: string;
}

export function usePostMessageMutation({ room }: {room: number | undefined}) {
     const {session} = useSession();

     return useMutation({
          mutationFn: (data: PostMessage) =>
               http
                    .post(`message/${room}/store`, {
                         headers: { Authorization: `Bearer ${session?.token}` },
                         json: data
                    })
                    .json(),
     })
}