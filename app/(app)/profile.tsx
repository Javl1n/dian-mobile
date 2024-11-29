import { useQueryClient } from '@tanstack/react-query';
import type { SubmitHandler } from 'react-hook-form';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, ScrollView, Text, TouchableHighlight, View, TextInput as Input } from 'react-native';
import DatePicker from 'react-native-date-picker';

import tw from 'twrnc';

import { TextInput } from '@/components/form/text-input';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/context/toast';
import type { UserProfile } from '@/features/profile/useUserMutation';
import { useUpdateUserProfileMutation } from '@/features/profile/useUserMutation';
import { useEditInterestQuery, useUserQuery } from '@/features/profile/useUserQuery';
import { handleApiErrors } from '@/utils/helpers';
import { Icon } from '@/components/ui/icon';
import { useEffect, useState } from 'react';
import { formatDate, formatRelative } from 'date-fns';

export default function Profile() {
  const { data: user } = useUserQuery();
  const { showToast } = useToast();
  const queryClient = useQueryClient();


  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<UserProfile>({
    defaultValues: {
      name: user?.name,
      bio: user?.bio as string,
      password: null,
      password_confirmation: null,
      gender: user?.gender,
      interests: [],
      birth_date: user?.birthdate !== null ? formatDate(new Date(user?.birthdate as string), 'yyyy-M-d') : '',
    },
  });

  const userUpdate = useUpdateUserProfileMutation();

  const onSubmit: SubmitHandler<UserProfile> = async (data: UserProfile) => {
    userUpdate.mutate(data, {
      onError: async (error) => {
        console.log(error);
        await handleApiErrors({ error, setError, showToast });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['user'] });
        showToast({
          type: 'success',
          message: 'User updated successfully',
          duration: 1000,
        });
      },
    });
  };

  return (
    <ScrollView style={tw`flex-1 p-4`}>
      <View style={tw`items-center mb-6`}>
        <Avatar
          source={{
            uri: `https://ui-avatars.com/api/?name=${user?.name.replace(
              ' ',
              '+',
            )}&size=128"`,
          }}
          size="lg"
        />
      </View>

      <View style={tw`mb-4`}>
        <Text style={tw`text-gray-600 mb-2`}>Name</Text>
        <Controller
          name="name"
          control={control}
          rules={{ required: 'Name is required' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Enter your name"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.name?.message}
            />
          )}
        />
      </View>

      <View style={tw`mb-4`}>
        <Text style={tw`text-gray-600 mb-2`}>Your Bio</Text>
        <Controller
          name="bio"
          control={control}
          // rules={{ maxLength: 60 }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              multiline
              style={tw`border py-2 px-4 rounded-md border-black/20`}
              placeholder="Enter your bio"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
      </View>

      <View style={tw`mb-4`}>
        <Text style={tw`text-gray-600 mb-2`}>Gender</Text>
          <Controller
            name="gender"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Gender onChange={onChange} value={value} />
            )}  
          />
      </View>

      <View style={tw`mb-4`}>
        <Text style={tw`text-gray-600 mb-2`}>Birth Date</Text>
          <Controller
            name="birth_date"
            control={control}
            render={({ field: { onChange, value } }) => (
              <BirthDate onChange={onChange} value={value} />
            )}  
          />
      </View>

      <View style={tw`mb-4`}>
        <Text style={tw`text-gray-600 mb-2`}>Interests</Text>
        <Controller
          name="interests"
          control={control}
          rules={{ required: 'Name is required' }}
          render={({ field: { onChange, value } }) => (
            <Interest onChange={onChange} value={value} />
          )}
        />
      </View>

      <View style={tw`mb-4`}>
        <Text style={tw`text-gray-600 mb-2`}>Password</Text>
        <Controller
          name="password"
          control={control}
          rules={{
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Enter new password"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value || ''}
              secureTextEntry
              error={errors.password?.message}
            />
          )}
        />
      </View>

      <View style={tw`mb-4`}>
        <Controller
          name="password_confirmation"
          control={control}
          rules={{
            validate: (value) =>
              /* eslint no-underscore-dangle: 0 */
              value === control._formValues.password ||
              'Passwords do not match',
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Confirm new password"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value || ''}
              secureTextEntry
              error={errors.password_confirmation?.message}
            />
          )}
        />
      </View>

      <Button style={tw`mb-12`} 
      // disabled={userUpdate.isPending} 
      onPress={handleSubmit(onSubmit)}>
        Save Changes
      </Button>
    </ScrollView>
  );
}

function Gender({ onChange, value }: {onChange: any, value: boolean}) {
  return (
    <View style={tw`flex-row gap-4`}>
      <Pressable onPress={() => {
        onChange(true);
      }} style={tw`p-3 border rounded flex-1 ${
        value ? 'bg-blue-100 border-blue-500' : 'border-black/20'
      }`}>
        <Text style={tw`text-center ${value ? 'text-blue-700' : 'text-black'}`}>Male</Text>
      </Pressable>
      <Pressable onPress={() => {
        onChange(false);
      }} style={tw`p-3 border rounded flex-1 ${
        value ? 'border-black/20' : 'bg-pink-100 border-pink-500'
      }`}>
        <Text style={tw`text-center ${value ? 'text-black' : 'text-pink-700'}`}>Female</Text>
      </Pressable>
    </View>
  )
}

function BirthDate({ onChange, value }: {onChange: any, value: string | null}) {
  const {data: user} = useUserQuery();
  const [date, setDate] = useState(
    user?.birthdate !== null ? new Date(user?.birthdate as string) :
    new Date(new Date().getFullYear() - 18, new Date().getMonth(), new Date().getDate())
  );
  const [open, setOpen] = useState(false);
  const [hasSelected, setHasSelected] = useState(false);

  return (
    <>
      {/* <TouchableHighlight 
        activeOpacity={0.2}
        underlayColor={tw.color('text-black')} 
        onPress={() => setOpen(true)}
        style={tw`p-3 rounded-md bg-neutral-800`}
      >
        <Text style={tw`text-center text-white font-bold`}>
          {user?.birthdate !== null || hasSelected ? formatDate(date as Date, 'MMMM do y') : 'Select Date of Birth'}
        </Text>
      </TouchableHighlight> */}
      <Button onPress={() => setOpen(true)}>
        {user?.birthdate !== null || hasSelected ? formatDate(date as Date, 'do MMMM y') : 'Select Date of Birth'}
      </Button>
      <DatePicker
        modal
        open={open}
        mode='date'
        maximumDate={new Date(new Date().getFullYear() - 18, new Date().getMonth(), new Date().getDate())}
        date={date}
        theme='light'
        onConfirm={(date) => {
          setHasSelected(true);
          setOpen(false);
          setDate(date);
          onChange(formatDate(date, 'yyyy-M-d'));
        }}
        onCancel={() => setOpen(false)}
      />

    </>
  );
}

function Interest({ onChange, value }: {onChange: any, value: string[]}) {
  const [interestInput, setInterestInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { data: interests, isSuccess } = useEditInterestQuery(); 

  useEffect(() => {
    if (isSuccess) {
      onChange([...interests!.my_interests]);
    }
  }, [isSuccess, interests, onChange]);

  const textChange = (value: string) => {
    setInterestInput(value);
    if (value === '') {
      setSuggestions([]);
    } else {
      setSuggestions([...interests!.all_interests.filter((interest) => interest.match(value))]);
    }
  };

  const saveInput = () => {
    if (interestInput !== '') {
      if (!value.includes(interestInput)) {
        onChange([...value, interestInput]);
      }
      setInterestInput('');
    }
  }

  return (
    <View style={tw`gap-2`}>
      <View style={tw`flex-row gap-2`}>
        <View style={tw`flex-1`}>
          <View style={tw`absolute z-50 bottom-12 bg-white rounded-md w-full`}>
            {suggestions.map((interest, index) => {
              return(
                <TouchableHighlight 
                  key={index}
                  activeOpacity={0.1}
                  underlayColor={tw.color('text-gray-100')}
                  onPress={() => {
                    setInterestInput(interest);
                    setSuggestions([]);
                  }}
                >
                  <Text style={tw`px-4 py-2`}>{interest}</Text>
                </TouchableHighlight>
              );
            })}
          </View>
          <TextInput
            placeholder="Enter your interests"
            onChangeText={(value) => textChange(value)}
            value={interestInput}
          />
          
        </View>
        <Pressable onPress={() => saveInput()} style={tw`bg-neutral-800 w-12 rounded-md`}>
          <Icon name="send" size={20} style={tw`my-auto mx-auto`} color={tw.color('text-white')} />
        </Pressable>
      </View>
      <View style={tw`flex-row flex-wrap gap-2`}>
        {value.map((interest: string, index: number) => {
          return (
            <View key={index} style={tw`p-2 border border-black/20 rounded-md flex-row gap-1`}>
              <Text>{interest}</Text>
              <Pressable onPress={() => {
                onChange(value.filter((interestValue: string) => interestValue !== interest));
              }}>
                <Icon name="close" size={15} style={tw`my-auto mx-auto`} color={tw.color('text-black/40')} />
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
}