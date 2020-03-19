import React from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  Button,
  StatusBar,
} from 'react-native';
import {
  Walkthrough,
  WalkthroughComponent,
  startWalkthrough,
} from 'react-native-wlkt';

const styles = StyleSheet.create({
  base: {
    flex: 1,
  },
  header: {
    backgroundColor: 'cornflowerblue',
    height: 50,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  startButton: {
    backgroundColor: 'aliceblue',
    borderRadius: 15,
    marginRight: 10,
  },
});

const myAmazingScenario = [
  {
    component: 'homeTile1',
    content: "I'm the step #1",
  },
  {
    component: 'homeTile2',
    content: "I'm the step #2",
    spotlightOptions: {
      borderColor: 'red',
    },
  },
  {
    component: 'homeTile3',
    content: "I'm the step #3",
  },
  {
    component: 'homeTile4',
    content: "I'm the step #4",
  },
];

const ExampleScreen = () => {
  const Card = React.forwardRef(({ label }, ref) => {
    return (
      <View
        ref={ref}
        style={{
          flex: 1,
          backgroundColor: 'lightgrey',
          borderRadius: 30,
          margin: 10,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{
            color: 'black',
            fontWeight: 'bold',
            fontSize: 30,
          }}>
          {label}
        </Text>
      </View>
    );
  });

  return (
    <View style={{ ...styles.base }}>
      <View style={{ ...styles.header }}>
        <View style={{ ...styles.startButton }}>
          <Button
            onPress={() => startWalkthrough({ scenario: myAmazingScenario })}
            title="Start"
          />
        </View>
      </View>
      <View style={{ flex: 2, flexDirection: 'row' }}>
        <View style={{ flex: 1 }}>
          <WalkthroughComponent id="homeTile1">
            <Card label="1" />
          </WalkthroughComponent>
          <WalkthroughComponent id="homeTile2">
            <Card label="2" />
          </WalkthroughComponent>
        </View>
        <WalkthroughComponent id="homeTile3">
          <Card label="3" />
        </WalkthroughComponent>
      </View>
      <WalkthroughComponent id="homeTile4">
        <Card label="4" />
      </WalkthroughComponent>
    </View>
  );
};

const App = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{ ...styles.base }}>
        <ExampleScreen />
      </SafeAreaView>
      <Walkthrough
        spotlightOptions={{
          borderWidth: 5,
          borderRadius: 10,
          borderColor: 'orange',
          padding: 5,
        }}
      />
    </>
  );
};

export default App;
