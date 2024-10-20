import { Text, View, TextInput, Pressable, RefreshControl } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import tw from 'twrnc';
import { Avatar } from '@/components/ui/avatar';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Link, router } from 'expo-router';
import { User, useUserQuery } from '@/features/profile/useUserQuery';
import { Post, usePostsQuery } from '@/features/post/usePostQuery';
import { format, formatDistance, formatRelative } from 'date-fns';
import { useRefreshOnFocus } from '@/hooks/useRefreshOnFocus';

export default function Index() {
     const { data: user, refetch } = useUserQuery();
     return (
          <ScrollView style={tw`flex-1`}>
               <CreatePost user={user!} />
               <PostList />
          </ScrollView>
     );
}

const PostList = () => {
     const { data: posts, isLoading, refetch, isRefetching } = usePostsQuery();
     // console.log(posts);
     useRefreshOnFocus(refetch);

     if (isLoading) return null;
     if (isRefetching) return null;

     return (
          <>
               {(posts as Array<Post>).splice(0).reverse().map((post) => {
                    const createdDate = new Date(post.created_at);
                    return (
                         <View key={post.id} style={tw`bg-white py-2 px-3 mt-2`}>
                              <View style={tw`flex flex-row gap-2`}>
                                   <Avatar
                                        size="xs"
                                        source={{
                                             uri: `https://i.pravatar.cc/300`,
                                        }}
                                   />
                                   <View style={tw`my-auto`}>
                                        <Text style={tw`text-base font-bold`}>{post.user.name}</Text>
                                        <Text style={tw`text-xs`}>{formatRelative(createdDate, new Date())}</Text>
                                   </View>
                              </View>
                              <View style={tw`px-1 py-4`}>
                                   <Text style={tw`text-2xl font-light`}>{post.content}</Text>
                              </View>
                         </View>
                    );
               })}
          </>
     );
}


const CreatePost = ({ user }: {user: User}) => {
     const [pressed, setPressed] = useState(false);
     return (
          <View style={tw`bg-white py-2 px-3 border-t border-gray-100 flex flex-row gap-3`}>
               <Avatar
                    size="xs"
                    source={{
                         uri: `https://i.pravatar.cc/300?=img=${user?.id}`,
                    }}
               />
               <Pressable
                    onPressIn={() => { setPressed(true) }}
                    onPressOut={() => { 
                         setPressed(false); 
                    }}
                    onPress={() => router.push('/posts/create')}
                    style={[
                         tw`flex-1 border focus:bg-gray-100 border-gray-200 rounded-full h-10 my-auto px-4`,
                         pressed ? [tw`bg-gray-100`, {transform: [{scale: .95}]},] : tw`bg-white`,
                    ]}
               >
                    <Text style={tw`text-neutral-950 my-auto text-base`}>What's on your mind?</Text>
               </Pressable>
               <Icon name="image" size={25} style={tw`my-auto`} color={tw.color('text-green-500')} />
          </View>
     );
}
