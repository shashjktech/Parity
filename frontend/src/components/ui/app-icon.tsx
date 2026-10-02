import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

/** Describes an icon by library + glyph name, so screens can keep icons in plain data. */
export type IconSpec =
  | { family: 'ionicons'; name: ComponentProps<typeof Ionicons>['name'] }
  | { family: 'material'; name: ComponentProps<typeof MaterialCommunityIcons>['name'] };

type Props = { icon: IconSpec; size: number; color: string };

export function AppIcon({ icon, size, color }: Props) {
  return icon.family === 'ionicons' ? (
    <Ionicons name={icon.name} size={size} color={color} />
  ) : (
    <MaterialCommunityIcons name={icon.name} size={size} color={color} />
  );
}