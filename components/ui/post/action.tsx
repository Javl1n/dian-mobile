import { Pressable, PressableProps, Text, View } from 'react-native';
import tw from 'twrnc';
import { Icon } from '../icon';
import { useState } from 'react';

interface ActionProps extends PressableProps {
     icon: string;
     text: string;
     color?: "default" | string;
}

export default function PostAction ({
     text, 
     icon, 
     color="default", 
     ...props
}: ActionProps) {
     const [pressed, setPressed] = useState<boolean>(false)
     const textColor = color == 'default' ? 'text-gray-500' : color;
     const bgColor = pressed ? 'bg-gray-50' : 'bg-white'
     return (
          <Pressable 
               {...props}
               onPressIn={() => setPressed(true)}
               onPressOut={() => setPressed(false)}
               style={tw`flex-1 flex-row justify-center gap-1 py-2 ${bgColor}`}
          >
               <Icon size={25} style={tw`${textColor}`} name={icon} />
               <Text style={tw`my-auto ${textColor} font-medium`}>{text}</Text>
          </Pressable>
     );
}