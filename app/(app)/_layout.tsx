import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { useQueryClient } from '@tanstack/react-query';
import { Redirect, router, Stack } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { Pressable, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import tw from 'twrnc';

import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { useSession } from '@/context/session';
import { logout } from '@/features/auth/useAuthMutations';
import { useUserQuery } from '@/features/profile/useUserQuery';

const UserProfile = () => {
  const { data: user, isLoading } = useUserQuery();

  if (isLoading) return null;

  return (
    <View style={tw`flex flex-row items-center justify-between p-4`}>
      <Pressable
        onPress={() => router.push('/profile')}
        style={tw`flex flex-row items-center gap-2`}
      >
        <Avatar
          size="xs"
          source={{
            uri: `https://ui-avatars.com/api/?name=${user?.name.replace(' ', '+')}&size=64"`,
          }}
        />
        <View style={tw`flex flex-col`}>
          <Text style={tw`text-sm font-medium`}>{user?.name}</Text>
          <Text style={tw`text-xs text-gray-500`}>View Profile</Text>
        </View>
      </Pressable>
      <Icon name="chevron-forward" size={20} />
    </View>
  );
};

const DrawerContent = (props: any) => {
  const { bottom } = useSafeAreaInsets();
  const { session, setSession } = useSession();
  const queryClient = useQueryClient();

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView
        scrollEnabled={false}
        contentContainerStyle={tw`bg-gray-100`}
      >
        <UserProfile />
        <View style={tw`bg-white pt-2`}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>

      <View
        style={tw.style('p-4', {
          paddingBottom: 20 + bottom,
        })}
      >
        <Button
          onPress={async () => {
            const response = await logout({ token: session?.token });
            if (response) {
              setSession(null);
              console.log(session);
              queryClient.invalidateQueries();
            }
          }}
          variant="outline"
        >
          Logout
        </Button>
      </View>
    </View>
  );
};

const HomeIcon = ({ size, color }: { size: number; color: string }) => {
  return <Icon name="home-outline" size={size} color={color} />;
};

const MessageIcon = ({ size, color }: { size: number; color: string }) => {
  return <Icon name="chatbubbles-outline" size={size} color={color} />;
};

const PairIcon = ({ size, color }: { size: number; color: string }) => {
  return <Icon name="people-outline" size={size} color={color} />;
};

export default function AppLayout() {
  const { session } = useSession();

  if (!session?.token) {
    return <Redirect href="/login" />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={DrawerContent}
        screenOptions={{ drawerHideStatusBarOnOpen: false }}
      >
        <Drawer.Screen
          name="posts/index"
          options={{
            drawerLabel: 'Home',
            title: 'Home',
            drawerIcon: HomeIcon,
          }}
        />
        <Drawer.Screen
          name="people/index"
          options={{
            drawerLabel: 'People',
            title: 'People',
            drawerIcon: PairIcon,
          }}
        />
        <Drawer.Screen
          name="messages/index"
          options={{
            drawerLabel: 'Messages',
            title: 'Messages',
            drawerIcon: MessageIcon,
          }}
        />
        <Drawer.Screen
          name="messages/[id]"
          options={{
            // drawerLabel: 'Create Post',
            title: 'Create Post',
            drawerItemStyle: { display: 'none' },
          }}
        />
        <Drawer.Screen
          name="posts/create"
          options={{
            drawerLabel: 'Create Post',
            title: 'Create Post',
            drawerItemStyle: { display: 'none' },
          }}
        />
        <Drawer.Screen
          name="index"
          options={{
            drawerItemStyle: { display: 'none' },
          }}
        />
        <Drawer.Screen
          name="profile"
          options={{
            drawerLabel: 'Profile',
            title: 'Edit Profile',
            drawerItemStyle: { display: 'none' },
          }}
        />
        {/* <Drawer.Screen
          name="book/[id]" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: "Books",
            title: "overview",
          }}
        /> */}
      </Drawer>
    </GestureHandlerRootView>
    
  );
}
