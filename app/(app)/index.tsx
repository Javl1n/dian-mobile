import { useSession } from "@/context/session";
import { Redirect } from "expo-router";
import { useRouter, useFocusEffect } from "expo-router";

export default function Page() {
     const router = useRouter();

     useFocusEffect(() => {
          router.replace('/posts');
     });

     return;
}