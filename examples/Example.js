import React from 'react';
import { View, Text, Button } from 'react-native';
import {
  Walkthrough,
  WalkthroughComponent,
  startWalkthrough,
} from 'react-native-wlkt';

const myAmazingScenario = [
  {
    component: 'textRnwlkt',
    tooltipOptions: {
      content: 'I am a TEXT element',
    },
  },
  {
    component: 'buttonRnwlkt',
    tooltipOptions: {
      content: 'I am a BUTTON element',
    },
  },
];

const ExampleScreen = () => {
  return (
    <>
      <WalkthroughComponent id="textRnwlkt">
        <Text>RNWLKT</Text>
      </WalkthroughComponent>
      <WalkthroughComponent id="buttonRnwlkt">
        <View>
          <Button
            title="RNWLKT"
            onPress={() => {
              console.log('Clicked');
            }}
          />
        </View>
      </WalkthroughComponent>
      <Button
        title="Start"
        onPress={() => {
          startWalkthrough({ scenario: myAmazingScenario });
        }}
      />
      <Walkthrough />
    </>
  );
};

export default ExampleScreen;