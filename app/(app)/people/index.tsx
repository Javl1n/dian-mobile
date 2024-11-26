import { pair, usePeopleQuery } from "@/features/people/usePeopleQuery";
import { Image, Pressable, RefreshControl, Text, View, ScrollView } from "react-native";
import tw from 'twrnc';
import { User, useUserQuery } from "@/features/profile/useUserQuery";
import { useCallback, useState } from "react";
import PostHeader from "@/components/ui/post/header";
import PostAction from "@/components/ui/post/action";
import { useSession } from "@/context/session";

export default function Index() {
     const [refreshing, setRefreshing] = useState(false);
     const { 
          data: people, 
          isLoading: isLoadingPeople, 
          refetch: refetchPeople, 
          isRefetching: isRefetchingPeople 
     } = usePeopleQuery();

     const onRefresh = useCallback(() => {
          setRefreshing(true);
          // setTimeout(() => {
               refetchPeople();
          // }, 2000);
          setTimeout(() => {
               setRefreshing(false);
          }, 500);
     }, []);

     return (
          <ScrollView 
               style={tw`flex-1`}
               refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
               }
          >
               <PeopleList isLoadingPeople={isLoadingPeople} isRefetching={isRefetchingPeople} people={people} />
          </ScrollView>
     );
}

const PeopleList = ({isLoadingPeople, people, isRefetching}: {isLoadingPeople: boolean, people: any, isRefetching: boolean}) => {

     if (isLoadingPeople || isRefetching) return null;

     return (
          <View style={tw`mb-2`}>
               {(people as User[])?.map((person) => {
                    return <PersonInfo key={person.id} person={person} />
               })}
          </View>
     )
}

const PersonInfo = ({person} : {
     person: User,
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
     const { session, setSession } = useSession();
     const { data: user, refetch: refetchUser } = useUserQuery();
     // const user = session?.user;

     const match = person?.followers.filter((match) => match.follower_id == user!.id)[0] ?? null ;
     
     const status = match == null ? null
                    : match?.status == 1 ? true : false

     const [action, setAction] = useState<boolean | null>(status);
     const ignoreActionLogic = !action && action !== null;

     const pressActionState = (state: boolean) => {
          if (action !== state || action === null) setAction(state);
          if (action === state) setAction(null)
     }

     const followPerson = async (state: boolean) => {
          const response = await pair({ 
               token: session?.token, 
               user: person.id, 
               action: state ? "follow" : "unfollow" 
          });
          if (response) {
               pressActionState(state);
          }
     }

     return (
          <View style={tw`flex flex-row text-lg`}>
               <PostAction
                    text={ignoreActionLogic ? "Ignored" : "Ignore"}
                    icon={ignoreActionLogic ? "heart-dislike" : 'heart-dislike-outline'}
                    color={ignoreActionLogic ? "text-red-500" : 'default'}
                    onPress={() => {
                         followPerson(false);
                    }}
               />
               <PostAction
                    text={action ? "Followed" : "Follow"}
                    icon={action ? "heart" : 'heart-outline'}
                    color={action ? "text-red-500" : 'default'}
                    onPress={() => {
                         followPerson(true);
                    }}
               />
          </View>
     );
}