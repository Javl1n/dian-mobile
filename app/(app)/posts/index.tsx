import { Text, View, TextInput, Pressable, RefreshControl, ScrollView } from 'react-native';
import tw from 'twrnc';
import { Avatar } from '@/components/ui/avatar';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import PostHeader from '@/components/ui/post/header';
import { useCallback, useState } from 'react';
import { Link, router } from 'expo-router';
import { User, useUserQuery } from '@/features/profile/useUserQuery';
import { Post, usePostsQuery } from '@/features/post/usePostQuery';
import { format, formatDistance, formatRelative } from 'date-fns';
import { useRefreshOnFocus } from '@/hooks/useRefreshOnFocus';

export default function Index() {
     const [refreshing, setRefreshing] = useState(false);
     const { data: user, refetch: refetchUser } = useUserQuery();
     const { 
          data: posts, 
          isLoading: isLoadingPosts, 
          refetch: refetchPosts, 
          isRefetching: isRefetchingPosts 
     } = usePostsQuery();
     // console.log(posts);
     useRefreshOnFocus(refetchPosts);

     const onRefresh = useCallback(() => {
          refetchPosts();
          setRefreshing(true);
          if (isRefetchingPosts) setRefreshing(false);
          // setTimeout(() => {
          //      setRefreshing(false);
          //      refetchPosts();
          // }, 2000);
     }, []);

     return (
          <ScrollView 
               style={tw`flex-1`}
               refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
               }
          >
               <CreatePostSection user={user!} />
               <PostList posts={posts} isLoading={isLoadingPosts} isRefetching={isRefetchingPosts} />
          </ScrollView>
     );
}

const PostList = ({isLoading, isRefetching, posts}: {isLoading: boolean, isRefetching: boolean, posts: any}) => {
     
     if (isLoading) return null;
     if (isRefetching) return null;

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
                         </View>
                    );
               })}
          </>
     );
}


const CreatePostSection = ({ user }: {user: User}) => {
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
