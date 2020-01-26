import React, { useEffect } from 'react';
import { View, Animated } from 'react-native';
import { CustomText, CustomButton } from './WalkthroughCustoms';

import { compare } from './WalkthroughFunction';

const buttons = {
  buttonPrev: {
    backgroundColor: 'transparent',
    padding: 5
  },
  buttonNext: {
    backgroundColor: '#27AE60',
    borderRadius: 5,
    padding: 5
  },
  buttonSkip: {
    backgroundColor: 'transparent',
    padding: 5
  }
};

const areEqual = (pprops, nprops) =>
  compare(pprops.tooltip, nprops.tooltip) &&
  compare(pprops.tooltipopts, nprops.tooltipopts);

const WalkthroughTooltip = React.memo(props => {
  const animation = {
    springValue: new Animated.Value(0),
    opacityValue: new Animated.Value(0)
  };
  const {
    tooltip: { top, left },
    tooltipopts: {
      width,
      height,
      borderRadius,
      backgroundColor,
      fontSize,
      content
    },
    tooltipcntx: { onPrev, onNext, onSkip, current, steps },
    duration,
    animated
  } = props;

  const animate = () => {
    if (animated)
      Animated.parallel([
        Animated.spring(animation.springValue, {
          toValue: 1,
          friction: 5
        }).start(),
        Animated.timing(animation.opacityValue, {
          toValue: 1,
          duration
        }).start()
      ]).start();
  };

  useEffect(() => {
    animate();
  });

  const hasPrevious = current > 1;

  return (
    <Animated.View
      style={{
        top,
        left,
        width,
        height,
        borderRadius,
        backgroundColor,
        padding: 10,
        opacity: animation.opacityValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1]
        }),
        transform: [{ scale: animation.springValue }]
      }}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <CustomText
          numberOfLines={height / 20}
          style={{ fontSize, lineHeight: 20, textAlign: 'center' }}
        >
          {content}
        </CustomText>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}
      >
        <CustomButton
          callback={onSkip}
          text="Skip"
          buttonStyle={buttons.buttonSkip}
          textStyle={{ fontSize: 12, color: '#7F8C8D' }}
        />
        <View
          style={{
            flexDirection: 'row'
          }}
        >
          {hasPrevious ? (
            <CustomButton
              callback={onPrev}
              text="Previous"
              buttonStyle={buttons.buttonPrev}
              textStyle={{ fontSize: 12, color: '#27AE60' }}
            />
          ) : null}
          <CustomButton
            callback={onNext}
            style={{
              justifyContent: 'center'
            }}
            text={current < steps ? `Next (${current}/${steps})` : 'Finish'}
            buttonStyle={buttons.buttonNext}
            textStyle={{ fontSize: 12, fontWeight: 'bold', color: 'white' }}
          />
        </View>
      </View>
    </Animated.View>
  );
}, areEqual);

export default WalkthroughTooltip;
