import React, { Component, useState, useEffect, useCallback } from 'react';
import { View } from 'react-native';
import WalkthroughOverlay from './WalkthroughOverlay';
import WalkthroughTooltip from './WalkthroughTooltip';
import { getComponents } from './WalkthroughComponent';
import { measureAsync, compare, tooltipPlacement } from './WalkthroughFunction';

class WalkthroughStep extends Component {
  constructor(props) {
    super(props);
    this.settings = null;
    this.state = {
      layout: null,
      selfLayout: null
    };
  }

  shouldComponentUpdate(nprops, nstate) {
    const { selfLayout, layout } = this.state;
    const { step } = this.props;

    return (
      step !== nprops.step ||
      !compare(selfLayout, nstate.selfLayout) ||
      !compare(layout, nstate.layout)
    );
  }

  componentDidUpdate() {
    this.getLayout();
  }

  measureComponent = async () => {
    const { selfLayout } = this.state;
    const { step } = this.props;

    const { padding = 0 } = step.spotlightOptions || {};

    const measurements = await measureAsync({
      component: getComponents()[step.component]
    });

    const layout = measurements &&
      selfLayout && {
        x: measurements.x - selfLayout.x - padding / 2,
        y: measurements.y - selfLayout.y - padding / 2,
        width: measurements.width + padding,
        height: measurements.height + padding
      };

    return layout;
  };

  getLayout = async () => {
    const layout = await this.measureComponent();

    this.setState({ layout });
  };

  fitInBox = (element, box) =>
    element.left >= box.left &&
    element.left + element.width <= box.left + box.width &&
    element.top >= box.top &&
    element.top + element.height <= box.top + box.height;

  findPlacement = () => {
    const { selfLayout } = this.state;
    const {
      step: {
        tooltipOptions: { width, height }
      }
    } = this.props;

    const placement = tooltipPlacement.find(p => {
      const tooltip = {
        height,
        width,
        ...this.getTooltipPosition(p)
      };
      const box = {
        height: selfLayout.height,
        width: selfLayout.width,
        top: selfLayout.y,
        left: selfLayout.x
      };
      return this.fitInBox(tooltip, box);
    });

    return placement;
  };

  getTooltipPosition = placement => {
    const { layout, selfLayout } = this.state;
    const {
      step: {
        tooltipOptions: { width, height, offset, offsetCenter }
      }
    } = this.props;
    const tooltipPosition = {};

    switch (placement) {
      case 'topleft':
      case 'top':
      case 'topright': {
        tooltipPosition.top = layout.y - height - offset;
        break;
      }
      case 'bottomleft':
      case 'bottom':
      case 'bottomright': {
        tooltipPosition.top = layout.y + layout.height + offset;
        break;
      }
      case 'lefttop':
      case 'left':
      case 'leftbottom': {
        tooltipPosition.left = layout.x - width - offset;
        break;
      }
      case 'righttop':
      case 'right':
      case 'rightbottom': {
        tooltipPosition.left = layout.x + layout.width + offset;
        break;
      }
      default:
        tooltipPosition.left = selfLayout.width / 2 - width / 2;
        tooltipPosition.top = selfLayout.height / 2 - height / 2;
        break;
    }

    switch (placement) {
      case 'topleft':
      case 'bottomleft': {
        tooltipPosition.left =
          layout.x + -width + layout.width / 2 + offsetCenter;
        break;
      }
      case 'top':
      case 'bottom': {
        tooltipPosition.left = layout.x + layout.width / 2 - width / 2;
        break;
      }
      case 'topright':
      case 'bottomright': {
        tooltipPosition.left = layout.x + layout.width / 2 - offsetCenter;
        break;
      }
      case 'lefttop':
      case 'righttop': {
        tooltipPosition.top =
          layout.y + -height + layout.height / 2 + offsetCenter;
        break;
      }
      case 'left':
      case 'right': {
        tooltipPosition.top = layout.y + layout.height / 2 - height / 2;
        break;
      }
      case 'leftbottom':
      case 'rightbottom': {
        tooltipPosition.top = layout.y + layout.height / 2 - offsetCenter;
        break;
      }
      default:
        break;
    }

    return tooltipPosition;
  };

  createTooltipOptions = () => {
    const {
      context: { current, steps },
      step: {
        content,
        tooltipOptions,
        tooltipOptions: { text }
      }
    } = this.props;
    let { placement } = tooltipOptions;

    if (placement === null) placement = this.findPlacement();

    const getTextContext = value =>
      typeof value === 'function' ? value({ current, steps }) : value;

    return {
      tooltip: { ...this.getTooltipPosition(placement) },
      content: typeof content === 'function' ? content() : content,
      tooltipOptions: {
        ...tooltipOptions,
        text: {
          previous: getTextContext(text.previous),
          next: getTextContext(text.next),
          finish: getTextContext(text.finish),
          skip: getTextContext(text.skip)
        }
      }
    };
  };

  createSpotlightOptions = () => {
    const { layout } = this.state;
    const {
      step: { spotlightOptions, overlayOptions }
    } = this.props;

    return {
      spotlight: {
        top: layout.y,
        left: layout.x,
        height: layout.height,
        width: layout.width
      },
      spotlightOptions,
      overlayOptions
    };
  };

  render() {
    const { layout, selfLayout } = this.state;
    const {
      context: { steps, current, onPrev, onNext, onSkip }
    } = this.props;

    const options = layout && {
      spotlight: {
        ...this.createSpotlightOptions()
      },
      tooltip: {
        ...this.createTooltipOptions()
      },
      context: { onPrev, onNext, onSkip, steps, current }
    };

    return (
      <View
        style={{ flex: 1 }}
        ref={ref => {
          this.self = ref;
        }}
        onLayout={async () => {
          this.setState({
            selfLayout: await measureAsync({ component: this.self })
          });
        }}
        pointerEvents="box-none"
      >
        {options && selfLayout ? (
          <View style={{ flex: 1 }} pointerEvents="box-none">
            <WalkthroughOverlay
              animated
              duration={250}
              spotlight={options.spotlight.spotlight}
              spotlightopts={options.spotlight.spotlightOptions}
              overlayopts={options.spotlight.overlayOptions}
              overlaycntx={options.context}
            />
            <WalkthroughTooltip
              animated
              duration={750}
              tooltip={options.tooltip.tooltip}
              content={options.tooltip.content}
              tooltipopts={options.tooltip.tooltipOptions}
              tooltipcntx={options.context}
            />
          </View>
        ) : null}
      </View>
    );
  }
}

export default WalkthroughStep;
