import { Pressable, Text, View, ScrollView, RefreshControl } from 'react-native';
import tw from 'twrnc';
import { Avatar } from '@/components/ui/avatar';
import { Room, useRoomsQuery } from '@/features/messages/useMessageQuery';
import { useSession } from '@/context/session';
import { formatDistanceStrict } from 'date-fns';
import { Href, router } from 'expo-router';
import { useCallback, useState } from 'react';
import { useUserQuery } from '@/features/profile/useUserQuery';


const ChatTile = ({room}: {room: Room}) => {
  const { session } = useSession();
  const { data: user, refetch: refetchUser } = useUserQuery();
    //  const user = session?.user;

  const [pressed, setPressed] = useState(false);

  const chatMate = room.participants.filter((participant) => participant.user.id != user?.id)[0].user;

  const message = room.messages != undefined ? {
    time: room.latest_message.created_at,
    content: room.latest_message.content,
  } : {
    time: room.created_at,
    content: "New Pair!",
  };

  return (
    <Pressable
      onPressIn={() => { setPressed(true) }}
      onPressOut={() => { 
          setPressed(false); 
      }}
      onPress={() => {
        router.push((`/messages/${room.id}` as Href))
      }}
      style={[
        tw`p-5 bg-white flex flex-row gap-2`,
        pressed ? tw`bg-gray-50` : tw`bg-white`
      ]}
    >
        <Avatar
          size="sm"
          source={{
            uri: `https://ui-avatars.com/api/?name=${chatMate.name.replace(' ', '+')}&size=300"`,
          }}
        />
        <View style={tw`flex justify-center`}>
          <Text style={tw`text-base font-extrabold`}>{chatMate.name}</Text>
          <Text style={tw`text-xs text-gray-800`}>{message.content} &#8226; {formatDistanceStrict(message.time, new Date(), {addSuffix: false, })}</Text>
        </View>
    </Pressable>
  );
};

export default function Index() {
  const {
    data: rooms,
    isLoading: isLoading, 
    refetch: refetch, 
    isRefetching: isRefetching
  } = useRoomsQuery();

  const [refreshing, setRefreshing] = useState(false);
  
  const onRefresh = useCallback(() => {
    refetch();
    setRefreshing(true);
    if (isRefetching) setRefreshing(false);
    // setTimeout(() => {
    //      setRefreshing(false);
    //      refetch();
    // }, 2000);
  }, []);

  return (
    <ScrollView 
      style={tw`flex-1`}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {rooms?.map((room) => {
        return <ChatTile key={room.id} room={room} />;
      })}
    </ScrollView>
  );
}
