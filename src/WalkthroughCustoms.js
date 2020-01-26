import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

// Step 1: Extract first level beacons of the string
// Step 2: Reform the whole string inserting the right style for each beacon
// Step 3: Back to Step 1 (Until the string does not contain anymore beacons)
// Step 4: Return a <Text> containing the whole string with the right style for each beacon

const customizer = {
  U: {
    textDecorationStyle: 'solid',
    textDecorationLine: 'underline',
    textDecorationColor: '#FC1049',
  },
  S: {
    fontWeight: 'bold',
  },
  I: {
    fontStyle: 'italic',
  },
};

const defStyle = {
  fontSize: 20,
  color: '#000000',
};

const CustomText = props => {
  const { children, style } = props;
  const string = children;

  // Extracting first level beacons
  let index = 0;
  const subs = [];
  while (index < string.length && string.indexOf('<', index) !== -1) {
    const temp = string.substring(string.indexOf('<', index));
    const beacon = temp.substring(1, temp.indexOf('>'));
    if (temp.indexOf(`</${beacon}>`) === -1) break;
    const substring = temp.substring(
      temp.indexOf('>') + 1,
      temp.indexOf(`</${beacon}>`)
    );
    index = string.indexOf(`</${beacon}>`, index) + `</${beacon}>`.length;
    subs.push({ beacon, substring, index });
  }
  // Reforming the string with the right style for each beacon
  let idx = 0;
  const bundle = [];
  if (subs.length > 0) {
    while (idx < subs.length) {
      bundle.push(
        <Text key={`str-${idx}`}>
          {string.substring(
            idx === 0 ? 0 : subs[idx - 1].index,
            string.indexOf(
              `<${subs[idx].beacon}>`,
              idx === 0 ? 0 : subs[idx - 1].index
            )
          )}
        </Text>
      );
      // Recursive for substrings containing other beacons
      bundle.push(
        <CustomText
          key={`sub-${idx}`}
          style={{ ...customizer[subs[idx].beacon], ...style }}>
          {subs[idx].substring}
        </CustomText>
      );
      idx += 1;
    }
  }
  bundle.push(
    <Text key={`str-${idx}`}>
      {string.substring(idx === 0 ? 0 : subs[idx - 1].index)}
    </Text>
  );
  return <Text style={{ ...defStyle, ...style }} {...props}>{bundle}</Text>;
};

// Factoring for a simple use of styleable buttons
const CustomButton = ({
  disabled,
  callback,
  text,
  style,
  buttonStyle,
  textStyle,
}) => (
  <TouchableOpacity style={style} onPress={callback} disabled={disabled}>
    <View style={buttonStyle}>
      <Text style={textStyle}>{text}</Text>
    </View>
  </TouchableOpacity>
);

export { CustomText, CustomButton };
