import { Ionicons } from '@expo/vector-icons';

export type IconProps = {
  name: string;
  size?: number;
  color?: string;
  style?: any;
};

export const Icon = ({ name, size, color, style }: IconProps) => {
  return <Ionicons style={style} name={name as any} size={size} color={color} />;
};
