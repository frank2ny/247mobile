import React, { useState } from 'react';
import { Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';

type TapProps = Omit<PressableProps, 'style'> & {
  style?: StyleProp<ViewStyle>;
  /** Extra style while the finger is down. Defaults to a slight shrink. */
  pressedStyle?: StyleProp<ViewStyle>;
};

const DEFAULT_PRESSED: ViewStyle = { transform: [{ scale: 0.97 }], opacity: 0.92 };

/**
 * Pressable with press feedback that works under NativeWind.
 *
 * NativeWind wraps Pressable, and on Android/iOS that wrapper drops styles given as a
 * function (`style={({ pressed }) => ...}`), so layout and backgrounds vanish. Tap keeps
 * the pressed state itself and always passes a plain style.
 */
export function Tap({ style, pressedStyle = DEFAULT_PRESSED, onPressIn, onPressOut, ...rest }: TapProps) {
  const [pressed, setPressed] = useState(false);
  return (
    <Pressable
      {...rest}
      onPressIn={(e) => {
        setPressed(true);
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        setPressed(false);
        onPressOut?.(e);
      }}
      style={[style, pressed && pressedStyle]}
    />
  );
}
