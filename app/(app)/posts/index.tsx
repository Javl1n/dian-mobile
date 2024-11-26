import { Text, View, TextInput, Pressable, RefreshControl, ScrollView } from 'react-native';
import tw from 'twrnc';
import { Avatar } from '@/components/ui/avatar';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import PostHeader from '@/components/ui/post/header';
import PostAction from '@/components/ui/post/action';
import { useCallback, useState } from 'react';
import { Link, router } from 'expo-router';
import { User, useUserQuery } from '@/features/profile/useUserQuery';
import { Post, usePostsQuery } from '@/features/post/usePostQuery';
import { format, formatDistance, formatRelative } from 'date-fns';
import { useRefreshOnFocus } from '@/hooks/useRefreshOnFocus';
import { useSession } from '@/context/session';

export default function Index() {
     const [refreshing, setRefreshing] = useState(false);
     const { data: user, refetch: refetchUser } = useUserQuery();
     const {
          data: posts, 
          isLoading: isLoading, 
          refetch: refetch, 
          isRefetching: isRefetching 
     } = usePostsQuery();


     // useRefreshOnFocus(refetch);

     const onRefresh = useCallback(() => {
          refetch();
          setRefreshing(true);
          if (isRefetching) setRefreshing(false);
          setTimeout(() => {
               setRefreshing(false);
               refetch();
          }, 2000);
     }, []);

     if (isRefetching) return null;
     if (isLoading) return null;

     return (
          <ScrollView 
               style={tw`flex-1`}
               refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
               }
          >
               <CreatePostSection />
               <PostList posts={posts}  />
          </ScrollView>
     );
}

const PostList = ({posts}: {posts: any}) => {
     return (
          <>
               {(posts as Array<Post>).splice(0).reverse().map((post) => {
                    const createdDate = new Date(post.created_at);
                    return (
                         <View key={post.id} style={tw`bg-white py-2 px-3 mt-2`}>
                              <PostHeader 
                                   textHeader={post.user.name}
                                   avatarSize='xs'
                                   avatarUri={`https://ui-avatars.com/api/?name=${post.user.name.replace(' ', '+')}&size=300"`}
                                   subHeader={formatRelative(createdDate, new Date())}
                              />
                              <View style={tw`px-1 py-4`}>
                                   <Text style={tw`text-2xl font-light`}>{post.content}</Text>
                              </View>
                              <View style={tw`flex flex-row text-lg`}>
                                   <PostAction
                                        text="Like"
                                        icon="heart-outline"
                                        color="default"
                                        // onPress={() => {
                                        //      followPerson(false);
                                        // }}
                                   />
                                   <PostAction
                                        text="Comment"
                                        icon="chatbubble-outline"
                                        color="default"
                                        // onPress={() => {
                                        //      followPerson(false);
                                        // }}
                                   />
                                   {/* <PostAction
                                        text={action ? "Followed" : "Follow"}
                                        icon={action ? "heart" : 'heart-outline'}
                                        color={action ? "text-red-500" : 'default'}
                                        onPress={() => {
                                             followPerson(true);
                                        }}
                                   /> */}
                              </View>
                         </View>
                    );
               })}
          </>
     );
}


const CreatePostSection = () => {
     const { data: user, refetch: refetchUser } = useUserQuery();

     const [pressed, setPressed] = useState(false);
     return (
          <View style={tw`bg-white py-2 px-3 border-t border-gray-100 flex flex-row gap-3`}>
               <Avatar
                    size="xs"
                    source={{
                         uri: `https://ui-avatars.com/api/?name=${user?.name.replace(' ', '+')}&size=64"`,
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
