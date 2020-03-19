import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

// Factoring for a simple use of styleable buttons
const CustomButton = ({
  disabled,
  callback,
  text,
  style,
  buttonStyle,
  textStyle
}) => (
  <TouchableOpacity style={style} onPress={callback} disabled={disabled}>
    <View style={buttonStyle}>
      <Text style={textStyle}>{text}</Text>
    </View>
  </TouchableOpacity>
);

export { CustomButton };
