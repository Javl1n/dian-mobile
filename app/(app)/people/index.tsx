import { usePeopleQuery } from "@/features/people/usePeopleQuery";
import { ScrollView } from "react-native-gesture-handler";
import { Image, Pressable, RefreshControl, Text, View } from "react-native";
import tw from 'twrnc';
import { User } from "@/features/profile/useUserQuery";
import { useCallback, useState } from "react";
import PostHeader from "@/components/ui/post/header";
import PostAction from "@/components/ui/post/action";

export default function Index() {
     const [refreshing, setRefreshing] = useState(false);
     const { data: people, isLoading: isLoadingPeople, refetch: refetchPeople, isRefetching: isRefetchingPeople } = usePeopleQuery();

     const onRefresh = useCallback(() => {
          setRefreshing(true);
          setTimeout(() => {
               refetchPeople();
               setRefreshing(false);
          }, 2000);
     }, []);

     return (
          <ScrollView 
               style={tw`flex-1`}
               refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
               }
          >
               <PeopleList isLoading={isLoadingPeople} isRefetching={isRefetchingPeople} people={people} />
          </ScrollView>
     );
}

const PeopleList = ({isLoading, people, isRefetching}: {isLoading: boolean, people: any, isRefetching: boolean}) => {
     
     if (isLoading || isRefetching) return null;

     return (
          <View style={tw`mb-2`}>
               {(people as Array<User>).map((person) => {
                    return <PersonInfo person={person} />
               })}
          </View>
     )
}

const PersonInfo = ({person} : {
     person: User
}) => {
     
     return (
          <View key={person.id} style={tw`mt-2 bg-white`}>
               <View style={tw`p-2`}>
                    <PostHeader
                         textHeader={person.name}
                         avatarSize='xs'
                         avatarUri={`https://ui-avatars.com/api/?name=${person.name.replace(' ', '+')}&size=64"`}
                    />
                    <View style={tw`pt-2 px-1`}>
                         <Text style={tw`text-base`}>{person.bio}</Text>
                    </View>
               </View>
               <View>
                    <Image
                         style={tw`w-full aspect-square`} 
                         source={{ 
                              uri: `https://ui-avatars.com/api/?name=${person.name.replace(' ', '+')}&size=300"`
                         }}
                    />
               </View>
               <Actions person={person} />
          </View>
     )
}

const Actions = ({person}: {person: User}) => {

     const [action, setAction] = useState<boolean | null>(null);
     const ignoreActionLogic = !action && action !== null;

     const pressActionState = (state: boolean) => {
          if (action !== state || action === null) setAction(state);
          if (action === state) setAction(null)
     }

     return (
          <View style={tw`flex flex-row text-lg`}>
               <PostAction
                    text={ignoreActionLogic ? "Ignored" : "Ignore"}
                    icon={ignoreActionLogic ? "heart-dislike" : 'heart-dislike-outline'}
                    color={ignoreActionLogic ? "text-red-500" : 'default'}
                    onPress={() => {
                         pressActionState(false);
                    }}
               />
               <PostAction
                    text={action ? "Followed" : "Follow"}
                    icon={action ? "heart" : 'heart-outline'}
                    color={action ? "text-red-500" : 'default'}
                    onPress={() => {
                         pressActionState(true);
                    }}
               />
          </View>
     );
}