import { Avatar } from '@/components/ui/avatar';
import { Icon } from '@/components/ui/icon';
import { useToast } from '@/context/toast';
import { UploadPost, useUploadPostMutation } from '@/features/post/usePostMutations';
import { useUserQuery } from '@/features/profile/useUserQuery';
import { handleApiErrors } from '@/utils/helpers';
import { useQueryClient } from '@tanstack/react-query';
import { Stack, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { Text, TextInput, View, Pressable } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import tw from 'twrnc';

const HeaderLeft = () => {
     return (
          <Pressable
               onPress={() => router.push('/posts')}
               style={tw`px-3`}
          >
               <Icon name="arrow-back" size={25} color={tw.color('text-gray-900')} />
          </Pressable>
     )
}

export default function Create() {
     const { data: user, isLoading } = useUserQuery();
     const { showToast } = useToast();
     const queryClient = useQueryClient();


     const  [postPress, setPostPress] = useState(false);

     const uploadPost = useUploadPostMutation();

     const {
          control,
          handleSubmit,
          setError,
          formState: { errors },
        } = useForm<UploadPost>({
          defaultValues: {
            text_content: '',
            profile: false,
          },
        });

     const onSubmit: SubmitHandler<UploadPost> = async (data: UploadPost) => {
          setPostPress(false);
          uploadPost.mutate(data, {
               onError: async (error) => {
                    await handleApiErrors({error, setError, showToast})
               },
               onSuccess: async () => {
                    queryClient.invalidateQueries({ queryKey: ['user'] });
                    await showToast({
                         type: 'success',
                         message: 'Post uploaded successfully',
                         duration: 1000
                    });

                    router.push('/posts');
               },
          });
     }

     return (
          <ScrollView style={tw`flex-1 border-t border-gray-200 bg-white p-4`}>
               <Stack.Screen
                    options={{ 
                         title: 'Create Post',
                         headerLeft: () => (<HeaderLeft/>),
                         headerRight: () => (
                              <Pressable
                                   style={[
                                        tw`bg-blue-200 px-4 py-1 rounded-md mx-3`,
                                        postPress ? [{transform: [{scale: .95}]}, tw`bg-blue-300`] : null
                                   ]}
                                   onPressIn={() => setPostPress(true)}
                                   onPressOut={handleSubmit(onSubmit)}
                              >
                                   <Text style={[
                                        tw`text-blue-600 font-bold text-lg`,
                                   ]}>Post</Text>
                              </Pressable>
                         )
                     }}
               />
               <View style={tw`flex-row gap-3`}>
                    <Avatar
                         size="sm"
                         source={{
                              uri: `https://i.pravatar.cc/300?=img=${user?.id}`,
                         }}
                    />
                    <View>
                         <Text style={tw`text-lg font-semibold`}>{user?.name}</Text>
                    </View>
               </View>
               <View style={tw`pt-4`}>
                    <Controller 
                         name="text_content"
                         control={control}
                         render={({ field: { onChange, onBlur, value } }) => (
                              <TextInput 
                                   multiline
                                   value={value} 
                                   onBlur={onBlur}
                                   onChangeText={onChange} 
                                   placeholder="What's on your mind?" 
                                   style={tw`text-2xl`}
                              />
                         )} 
                    />
                    
               </View>
          </ScrollView>
     );
}