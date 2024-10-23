import { Text, View } from "react-native";
import { Avatar } from "../avatar";
import tw from 'twrnc';


export default function PostHeader ({
     textHeader,
     avatarSize,
     avatarUri,
     subHeader = null
}: {
     textHeader: string,
     avatarSize: "xs" | "sm" | "md" | "lg" | "xl" | undefined,
     avatarUri: string,
     subHeader?: string | null,
}) {
     return (
          <View style={tw`flex flex-row gap-2`}>
               <Avatar
                    size={avatarSize}
                    source={{
                         uri: avatarUri,
                    }}
               />
               <View style={tw`my-auto`}>
                    <Text style={tw`text-base font-bold`}>{textHeader}</Text>
                    {
                         subHeader !== null 
                         ? <Text style={tw`text-xs`}>{subHeader}</Text> 
                         : ''
                    }
               </View>
          </View>
     );
}