import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Animated,
  Easing,
  TouchableWithoutFeedback
} from 'react-native';
import { compare, maxValue, isValidSpotlight } from './WalkthroughFunction';
import { useComponentSize } from './WalkthroughHooks';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    height: '100%',
    width: '100%'
  }
});

const areEqual = (pprops, nprops) =>
  compare(pprops.spotlight, nprops.spotlight) &&
  compare(pprops.spotlightopts, nprops.spotlightopts) &&
  compare(pprops.overlayopts, nprops.overlayopts) &&
  compare(pprops.overlaycntx, nprops.overlaycntx);

const WalkthroughOverlay = React.memo(props => {
  const [layout, onLayout] = useComponentSize();
  const [animation] = useState({
    top: new Animated.Value(0),
    left: new Animated.Value(0),
    width: new Animated.Value(0),
    height: new Animated.Value(0),
    borderRadius: new Animated.Value(0),
    borderWidth: new Animated.Value(0),
    diagonal: new Animated.Value(0)
  });
  const {
    spotlight: { top, left, width, height },
    spotlightopts: { borderRadius, borderWidth },
    spotlightopts,
    overlayopts: { diagonalBuffer },
    overlayopts,
    overlaycntx,
    duration,
    animated
  } = props;

  const animate = () => {
    const horizontal = maxValue(left, layout.width - (left + width));
    const vertical = maxValue(top, layout.height - (top + height));

    const sd = borderRadius * Math.sqrt(2);

    const newDiagonal =
      Math.round(
        Math.sqrt(vertical ** 2 + horizontal ** 2) + (sd - borderRadius) / 2
      ) + diagonalBuffer;

    if (
      animated &&
      isValidSpotlight({
        top: animation.top.__getValue(),
        left: animation.left.__getValue(),
        width: animation.width.__getValue(),
        height: animation.height.__getValue()
      }) &&
      isValidSpotlight({ top, left, width, height })
    ) {
      Animated.parallel([
        Animated.timing(animation.top, {
          toValue: top,
          duration,
          easing: Easing.out(Easing.quad)
        }),
        Animated.timing(animation.left, {
          toValue: left,
          duration,
          easing: Easing.out(Easing.quad)
        }),
        Animated.timing(animation.width, {
          toValue: width,
          duration,
          easing: Easing.out(Easing.quad)
        }),
        Animated.timing(animation.height, {
          toValue: height,
          duration,
          easing: Easing.out(Easing.quad)
        }),
        Animated.timing(animation.borderWidth, {
          toValue: borderWidth,
          duration,
          easing: Easing.out(Easing.quad)
        }),
        Animated.timing(animation.borderRadius, {
          toValue: borderRadius,
          duration,
          easing: Easing.out(Easing.quad)
        }),
        Animated.timing(animation.diagonal, {
          toValue: newDiagonal,
          duration,
          easing: Easing.out(Easing.quad)
        })
      ]).start();
    } else {
      animation.top.setValue(top);
      animation.left.setValue(left);
      animation.width.setValue(width);
      animation.height.setValue(height);
      animation.borderRadius.setValue(borderRadius);
      animation.borderWidth.setValue(borderWidth);
      animation.diagonal.setValue(newDiagonal);
    }
  };

  useEffect(() => {
    if (layout) animate();
  });

  const renderSpotlight = () => {
    const smallest =
      animation.height._value < animation.width._value
        ? animation.height
        : animation.width;

    const spotlightBorderWidth = animation.borderWidth;
    const spotlightBorderRadius = animation.borderRadius;

    const spotlightWidth = Animated.add(
      animation.width,
      Animated.multiply(spotlightBorderWidth, 2)
    );
    const spotlightHeight = Animated.add(
      animation.height,
      Animated.multiply(spotlightBorderWidth, 2)
    );
    const spotlightTop = Animated.subtract(animation.top, spotlightBorderWidth);
    const spotlightLeft = Animated.subtract(
      animation.left,
      spotlightBorderWidth
    );

    const overlayBorderWidth = animation.diagonal;

    const overlayTop = Animated.subtract(
      Animated.subtract(animation.top, overlayBorderWidth),
      Animated.divide(spotlightBorderWidth, 2)
    );
    const overlayLeft = Animated.subtract(
      Animated.subtract(animation.left, overlayBorderWidth),
      Animated.divide(spotlightBorderWidth, 2)
    );
    const overlayHeight = Animated.add(
      Animated.add(Animated.multiply(overlayBorderWidth, 2), animation.height),
      spotlightBorderWidth
    );
    const overlayWidth = Animated.add(
      Animated.add(Animated.multiply(overlayBorderWidth, 2), animation.width),
      spotlightBorderWidth
    );

    // [(viewSize + smallest) / 2 - (smallest + (holeBorder * 2)) / 2 ; (viewSize + smallest) / 2]

    const overlayBorderRadius = Animated.add(
      Animated.subtract(
        Animated.divide(
          Animated.add(smallest, Animated.multiply(animation.diagonal, 2)),
          2
        ),
        Animated.divide(
          Animated.add(smallest, Animated.multiply(spotlightBorderWidth, 2)),
          2
        )
      ),
      spotlightBorderRadius
    );

    return (
      <TouchableWithoutFeedback
        onPress={() => overlayopts.onPress && overlayopts.onPress(overlaycntx)}
      >
        <View
          style={styles.container}
          pointerEvents={spotlightopts.clickThrough ? 'box-none' : 'auto'}
        >
          {/* Overlay */}
          <Animated.View
            style={{
              position: 'absolute',
              height: overlayHeight,
              width: overlayWidth,
              top: overlayTop,
              left: overlayLeft,
              borderWidth: overlayBorderWidth,
              borderRadius: overlayBorderRadius,
              backgroundColor: 'transparent',
              borderColor: overlayopts.backgroundColor,
              opacity: overlayopts.opacity
            }}
            pointerEvents={spotlightopts.clickThrough ? 'none' : 'auto'}
          />

          {/* Spotlight */}
          <Animated.View
            style={{
              position: 'absolute',
              height: spotlightHeight,
              width: spotlightWidth,
              top: spotlightTop,
              left: spotlightLeft,
              borderWidth: spotlightBorderWidth,
              borderRadius: spotlightBorderRadius,
              backgroundColor: 'transparent',
              borderColor: spotlightopts.borderColor,
              opacity: 1
            }}
            pointerEvents={spotlightopts.clickThrough ? 'none' : 'auto'}
          />

          {/* Wall Top */}
          <Animated.View
            style={{
              position: 'absolute',
              height: spotlightTop,
              width: layout.width,
              top: 0,
              left: 0
            }}
          />

          {/* Wall Left */}
          <Animated.View
            style={{
              position: 'absolute',
              height: spotlightHeight,
              width: spotlightLeft,
              top: spotlightTop,
              left: 0
            }}
          />

          {/* Wall Bottom */}
          <Animated.View
            style={{
              position: 'absolute',
              height: Animated.subtract(
                layout.height,
                Animated.add(spotlightTop, spotlightHeight)
              ),
              width: layout.width,
              top: Animated.add(spotlightTop, spotlightHeight),
              left: 0
            }}
          />

          {/* Wall Right */}
          <Animated.View
            style={{
              position: 'absolute',
              height: spotlightHeight,
              width: Animated.subtract(
                layout.width,
                Animated.add(spotlightLeft, spotlightWidth)
              ),
              top: spotlightTop,
              right: 0
            }}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  };

  const renderPlaceholder = () => {
    return (
      <TouchableWithoutFeedback
        onPress={() => overlayopts.onPress && overlayopts.onPress(overlaycntx)}
      >
        <View
          style={{
            ...styles.container,
            backgroundColor: overlayopts.backgroundColor,
            opacity: overlayopts.opacity
          }}
          pointerEvents={spotlightopts.clickThrough ? 'box-none' : 'auto'}
        />
      </TouchableWithoutFeedback>
    );
  };

  return (
    <View
      style={styles.container}
      onLayout={onLayout}
      pointerEvents={spotlightopts.clickThrough ? 'box-none' : 'auto'}
    >
      {layout ? renderSpotlight() : renderPlaceholder()}
    </View>
  );
}, areEqual);

export default WalkthroughOverlay;
