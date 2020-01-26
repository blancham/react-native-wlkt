## React-Native-Walkthrough

---

#### Simple and fully customizable walkthrough guide for your app!

Create amazing guides to help new users discovering your masterpiece :wink:

## **Introduction**

React-Native-Walkthrough is a library I started working on 6 month ago when I had spare time. I chose to develop it because I was looking for an easy to setup and highly customizable library to guide new users on my apps. 

As you can see on the demo, the component stays inside the parent we gave him. Also, everything is dynamically computed to allow an accurate placement of the spotlight or the tooltip.

## **Demo**

<p align="center">
  <img src="https://media.giphy.com/media/H1qzxPLSAxxcMceFwE/giphy.gif" alt="React Native Copilot" />
  <img src="https://media.giphy.com/media/KCYqV8saCZU7IlmNte/giphy.gif" alt="React Native Copilot" />
</p>

## **Install**

```bash
npm i react-native-wlkt

OR

yarn add react-native-wlkt
```

## **Getting Started**

## Setup

**Step 1** : Place the component `Walkthrough` wherever you want the tutorial to be.

> **TIPS**: Usually it is better to put it at the root of your app :smirk:

```jsx
import { Walkthrough } from 'react-native-wlkt';

...

const App = () => {
  return (
    <>
      ...
      <Walkthrough />
    </>
  );
};
```

**Congratulations, you've finished setting up `react-native-wlkt`** :tada:

_That wasn't so hard, was it?_

## Scenarios

**Step 1** : Register the components to be displayed in your interactive guide by encapsulating them in `WalkthroughComponent`.

```jsx
import { WalkthroughComponent } from 'react-native-wlkt';

...

const HomeScreen = () => {
  return (
    <>
      ...
      <WalkthroughComponent id="textRnwlkt">
        <Text>RNWLKT</Text>
      </WalkthroughComponent>
      ...
    </>
  );
};
```

> **TIPS**: When registering components, use an id coherent with the component being registered, it will help when creating scenarios :sunglasses:

> **NOTE**: `WalkthroughComponent` works with the basic React Native components, if your component is not registered, try to encapsulate it in a `View` component

```jsx
import { WalkthroughComponent } from 'react-native-wlkt';

...

const HomeScreen = () => {
  return (
    <>
      ...
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
      ...
    </>
  );
};

```

**Step 2** : Create your scenario.

```jsx
const myAmazingScenario = [
  {
    component: 'textRnwlkt',
    tooltipOptions: {
      content: 'I am a TEXT element'
    }
  },
  {
    component: 'buttonRnwlkt',
    tooltipOptions: {
      content: 'I am a BUTTON element'
    }
  }
];
```

**Step 3** : Start the tutorial with `startWalkthrough`.

```jsx
import { ..., startWalkthrough } from 'react-native-wlkt';

...

const HomeScreen = () => {
  return (
    <>
      ...
      <Button
        title="Start"
        onPress={() => {
          startWalkthrough({ scenario: myAmazingScenario })
        }}
      />
      ...
    </>
  );
};
```

**Okay, everything is setup now** :fire:

_You can find everything we did so far in `examples/Example.js`_.

## Scenario Options

> **NOTE**: `spotlightOptions`, `overlayOptions` and `tooltipOptions` can be set on each step and/or in `Walkthrough` props _(if they are in `Walkthrough` props, they are the default values for the steps)_

**component** {string} > `null` <br>
The registered component you wish to be highlighted.

**onNextIn** {function} > `null` <br>
Callback triggered when entering a step forward.

**onNextOut** {function} > `null` <br>
Callback triggered when leaving a step forward.

**onPrevIn** {function} > `null` <br>
Callback triggered when entering a step backward.

**onPrevOut** {function} > `null` <br>
Callback triggered when leaving a step backward.

### _spotlightOptions_

**spotlightOptions.borderWidth** {number} > `0` <br>
Width of the spotlight border.

**spotlightOptions.borderRadius** {number} > `0` <br>
Radius of the spotlight border.

**spotlightOptions.borderColor** {string} > `orange` <br>
Color of the spotlight border.

**spotlightOptions.padding** {number} > `0` <br>
Padding between the component and the spotlight.

**spotlightOptions.clickThrough** {boolean} > `false` <br>
Whether or not you can click through the spotlight.

### _overlayOptions_

**overlayOptions.backgroundColor** {string} > `black` <br>
Color of the overlay.

**overlayOptions.diagonalBuffer** {string} > `black` <br>
Increase the size of the overlay. _(this parameter is rarely used)_

**overlayOptions.opacity** {number} > `0.8` <br>
Opacity of the overlay.

**overlayOptions.onPress** {function} > `null` <br>
Callback triggered when clicking the overlay.

### _tooltipOptions_

**tooltipOptions.height** {number} > `100` <br>
Height of the tooltip.

**tooltipOptions.width** {number} > `230` <br>
Width of the tooltip.

**tooltipOptions.content** {string} > `''` <br>
Content of the tooltip. _(message to be displayed)_

**tooltipOptions.borderRadius** {number} > `10` <br>
Radius of the tooltip border.

**tooltipOptions.backgroundColor** {string} > `'white'` <br>
Color of the tooltip.

**tooltipOptions.fontSize** {number} > `15` <br>
Font size of the tooltip content.

**tooltipOptions.placement** {string} > `null` <br>
Placement of the tooltip. _(must be one of ['topleft', 'top', 'topright', 'lefttop', 'left', 'leftbottom', 'righttop', 'right', 'rightbottom', 'bottomleft', 'bottom', 'bottomright' ])_

> **NOTE**: If `tooltipOptions.placement` is not defined, the tooltip will be placed where there is available space.

**tooltipOptions.offsetCenter** {number} > `0` <br>
Offset between the center of the component and the tooltip. _(does not work when the tooltip is centered on the component e.g. with ['top', 'bottom', 'left', 'right'])_

**tooltipOptions.offset** {number} > `20` <br>
Offset between the component and the tooltip.

**tooltipOptions.tooltipComponent** {ReactNode} > `null` <br>
Component to display instead of the default tooltip. _(see [Custom Tooltip](#custom-tooltip))_

## Custom Tooltip

Your custom component will receive props from the `Walkthrough` :

**tooltip** :

```
top : ordinate position for the tooltip
left : abcisse position for the tooltip
```

**tooltipopts** : `tooltipOptions` from `Scenario Options` _(see [tooltipOptions](#tooltipoptions))_

**tooltipcntx** :

```
onPrev : handler for going to previous step
onNext : handler for going to next step
onSkip : handler for leaving the walkthrough
current : current step number
steps : number of steps in the scenario
```

_You can find an example in `examples/CustomTooltip.js`_.
