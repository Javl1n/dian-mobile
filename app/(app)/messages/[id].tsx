import tw from 'twrnc';
import { useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { Stack, router } from 'expo-router';
import { Icon } from "@/components/ui/icon";
import { ChatMessage, Room, useRoomQuery } from '@/features/messages/useMessageQuery';
import { useSession } from '@/context/session';
import { Controller, Message, SubmitHandler, useForm } from 'react-hook-form';
import { PostMessage, usePostMessageMutation } from '@/features/messages/useMessageMutation';
import { useEffect, useState } from 'react';
import { handleApiErrors } from '@/utils/helpers';
import { useToast } from '@/context/toast';
import { useQueryClient } from '@tanstack/react-query';
import { Avatar } from '@/components/ui/avatar';
import useEcho from '@/hooks/useEcho';
import { useUserQuery } from '@/features/profile/useUserQuery';


const HeaderLeft = () => {
     return (
          <Pressable
               onPress={() => router.push('/messages')}
               style={tw`px-3`}
          >
               <Icon name="arrow-back" size={25} color={tw.color('text-gray-900')} />
          </Pressable>
     )
}

export default function Show() {
     const { id } = useLocalSearchParams();
     const { session } = useSession();
     const user = session?.user;
     

     const {data: room, status } = useRoomQuery({ roomId: id as string })

     const pair = room?.participants.filter((participant) => participant.user.id != user?.id)[0].user

     const oldMessages = room?.messages;

     const [messages, setMessages] = useState<ChatMessage[]>([]);

     const echo = useEcho();

     useEffect(() => {
          console.log(`room.${room?.id}`);
          if (echo != undefined) {
               console.log('phase 1');
               // const channel = echo.private(`room.${room?.id}`)
               const channel = echo.channel(`testChannel`);
               channel.listen('MessageSent', ({message}: {message: ChatMessage}) => {
                    // console.log(message);
                    if(! messages.slice(0).map((currentMessage) => currentMessage.id).includes(message.id)) setMessages([...messages, message]);
                    // if(! messages.map((currentMessage) => currentMessage.id).includes(message.id)) console.log(message);
               });
          } 
     }, [messages]);

     return (
          <View style={tw`flex-1 bg-white`}>
               <Stack.Screen
                    options={{ 
                         title: pair?.name,
                         headerLeft: () => (<HeaderLeft/>),
                         headerRight: () => {
                              return (
                                   <Pressable
                                        onPress={() => router.push('/messages')}
                                        style={tw`pr-5`}
                                   >
                                        <Icon name="videocam" size={30} color={tw.color('text-blue-500')} />
                                   </Pressable>
                              )
                         }
                    }}
               />
               <ScrollView style={tw`flex-1 px-2 gap-2`}>
                    {oldMessages?.map((message) => (
                         <MessageTile key={message.id} message={message} />
                    ))}
                    {messages?.map((message) => (
                         <MessageTile key={message.id} message={message} />
                    ))}
               </ScrollView>
               <SendMessage room={room} />
          </View>
     );
}

function MessageTile ({ message }: { message: ChatMessage }) {
     const { session } = useSession();
     const { data: user, refetch: refetchUser } = useUserQuery();
     // const user = session?.user;

     const state = message.user.id == user?.id;
     
     return (
          <View style={[
               tw`gap-2`,
               state ? tw`flex-row-reverse` : tw`flex-row`
          ] }>
               <View style={tw`justify-end`}>
                    <Avatar
                         size="xxs"
                         source={{
                              uri: `https://ui-avatars.com/api/?name=${message.user?.name.replace(' ', '+')}&size=64"`,
                         }}
                    />
               </View>
               
               <Text style={[
                    tw`my-auto px-3 py-2 rounded-xl`,
                    state ? tw`bg-blue-700 text-white` : tw`bg-gray-100`
               ]}>
                    {message.content}
               </Text>
          </View>
     );
}

function SendMessage ({ room }: {room: Room | undefined}) {
     const [pressed, setPressed] = useState<boolean>(false);
     const { showToast } = useToast();
     const postMessage = usePostMessageMutation({room: room?.id});
     // const queryClient = useQueryClient();
     
     const {
          control,
          handleSubmit,
          setError,
          formState: { errors },
          reset
     } = useForm<PostMessage>({
          defaultValues: {
               text_content: '',
          },
     });

     const onSubmit: SubmitHandler<PostMessage> = async (data: PostMessage) => {
          setPressed(false);
          postMessage.mutate(data, {
               onError: async (error) => {
                    await handleApiErrors({error, setError, showToast})
               },
               onSuccess: async () => {
                    reset();
               },
          });
     }

     return (
          <View style={tw`flex-row px-4 py-2 gap-2`}>
               <Icon name="image" size={25} style={tw`my-auto`} color={tw.color('text-blue-500')} />
               {/* <Icon name="image" size={25} style={tw`my-auto`} color={tw.color('text-blue-500')} /> */}
               <View style={tw`rounded-full bg-blue-500 h-7 w-7 my-auto`}>
                    <Text style={tw`my-auto text-center  text-white font-black`}>AI</Text>
               </View>
               <Controller 
                    name="text_content"
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                         <TextInput 
                              multiline
                              value={value} 
                              onBlur={onBlur}
                              onChangeText={onChange} 
                              placeholder="Message" 
                              style={tw`rounded-3xl bg-gray-100 flex-1 px-4 py-1`}
                         />
                    )}
               />
               <Pressable 
                    onPressIn={() => setPressed(true)}
                    onPressOut={handleSubmit(onSubmit)}
                    style={[
                         tw`w-10 rounded-full`,
                         pressed ? tw`bg-gray-100` : tw``
                    ]}
               >
                    <Icon name="send" size={20} style={tw`my-auto mx-auto`} color={tw.color('text-blue-500')} />
               </Pressable>
          </View>
     );
}