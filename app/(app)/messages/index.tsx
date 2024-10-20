import { Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import tw from 'twrnc';
import { Avatar } from '@/components/ui/avatar';

const FakeChat = () => {
  return (
    <View style={tw`p-5 bg-white flex flex-row gap-2`}>
      <Avatar
          size="sm"
          source={{
            uri: `https://i.pravatar.cc/130`,
          }}
        />
      <View style={tw`flex justify-center`}>
        <Text style={tw`text-base font-extrabold`}>Frank Leimbergh</Text>
        <Text style={tw`text-xs text-gray-800`}>lorem ipsum dolor amote imo mama. &#8226; 8:16 PM</Text>
      </View>
    </View>
  );
};

export default function Index() {
  return (
    <ScrollView style={tw`flex-1`}>
      <FakeChat />
      <FakeChat />
      <FakeChat />
    </ScrollView>
  );
}
