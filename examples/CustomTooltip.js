import React from 'react';
import { View, Text, Button } from 'react-native';

const CustomTooltip = props => {
  const {
    tooltip: { top, left },
    tooltipopts: {
      width,
      height,
      borderRadius,
      backgroundColor,
      fontSize,
      content,
    },
    tooltipcntx: { onPrev, onNext, onSkip, current, steps },
  } = props;

  const hasPrevious = current > 1;

  return (
    <View
      style={{
        top,
        left,
        width,
        height,
        borderRadius,
        backgroundColor,
        padding: 10,
      }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize }}>{content}</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Button onPress={onSkip} title="Skip" />
        <View
          style={{
            flexDirection: 'row',
          }}>
          {hasPrevious ? <Button onPress={onPrev} title="Previous" /> : null}
          <Button
            onPress={onNext}
            title={current < steps ? 'Next' : 'Finish'}
          />
        </View>
      </View>
    </View>
  );
};

export default CustomTooltip;
