import React, { Component } from 'react';
import { View } from 'react-native';
import WalkthroughStep from './WalkthroughStep';
import {
  validScenario,
  formatOptions,
  mergeObject,
  mergeScenario,
  ifAvailable,
  tooltipPlacement
} from './WalkthroughFunction';

const defOpts = {
  component: { value: null, type: 'string' },
  content: { value: '', type: ['string', 'function'] },
  onNextIn: { value: null, type: 'function' },
  onNextOut: { value: null, type: 'function' },
  onPrevIn: { value: null, type: 'function' },
  onPrevOut: { value: null, type: 'function' },
  spotlightOptions: {
    borderWidth: { value: 0, type: 'number', valid: v => v >= 0 },
    borderRadius: { value: 0, type: 'number', valid: v => v >= 0 },
    borderColor: { value: 'orange', type: 'string' },
    padding: { value: 0, type: 'number', valid: v => v >= 0 },
    clickThrough: { value: false, type: 'boolean' }
  },
  overlayOptions: {
    backgroundColor: { value: 'black', type: 'string' },
    diagonalBuffer: { value: 10, type: 'number', valid: v => v >= 0 },
    opacity: { value: 0.8, type: 'number', valid: v => v >= 0 && v <= 1 },
    onPress: { value: null, type: 'function' }
  },
  tooltipOptions: {
    text: {
      previous: { value: 'Previous', type: ['string', 'function'] },
      next: {
        value: ({ current, steps }) => `Next (${current}/${steps})`,
        type: ['string', 'function']
      },
      finish: { value: 'Finish', type: ['string', 'function'] },
      skip: { value: 'Skip', type: ['string', 'function'] }
    },
    height: { value: 100, type: 'number', valid: v => v > 0 },
    width: { value: 230, type: 'number', valid: v => v > 0 },
    borderRadius: { value: 10, type: 'number', valid: v => v >= 0 },
    backgroundColor: { value: 'white', type: 'string' },
    fontSize: { value: 15, type: 'number', valid: v => v >= 0 },
    placement: {
      value: null,
      type: 'string',
      valid: v => tooltipPlacement.includes(v)
    },
    offsetCenter: { value: 0, type: 'number' },
    offset: { value: 20, type: 'number' },
    tooltipComponent: { value: null, type: 'any' }
  }
};

class Walkthrough extends Component {
  constructor(props) {
    super(props);

    this.scenario = [];
    this.state = {
      started: false,
      step: 0
    };
  }

  launch = ({ scenario }) => {
    const { step } = this.state;
    const { spotlightOptions, overlayOptions, tooltipOptions } = this.props;

    if (!validScenario(scenario)) return;

    const newScenario = scenario.map(item =>
      formatOptions(
        mergeObject({ spotlightOptions, overlayOptions, tooltipOptions }, item),
        defOpts
      )
    );

    this.scenario = mergeScenario(this.scenario, newScenario, step);

    ifAvailable(this.scenario[step].onNextIn);

    this.setState({ started: true });
  };

  handlePrevious = () => {
    const { step } = this.state;

    ifAvailable(this.scenario[step].onPrevOut);
    ifAvailable(this.scenario[step - 1].onPrevIn);

    this.setState(pstate => ({ step: pstate.step - 1 }));
  };

  handleNext = () => {
    const { step } = this.state;

    ifAvailable(this.scenario[step].onNextOut);
    if (step + 1 === this.scenario.length) {
      this.handleFinish();
      return;
    }
    ifAvailable(this.scenario[step + 1].onNextIn);

    this.setState(pstate => ({ step: pstate.step + 1 }));
  };

  handleFinish = () => {
    this.scenario = [];
    this.setState({ started: false, step: 0 });
  };

  handleSkip = () => {
    this.scenario = [];
    this.setState({ started: false, step: 0 });
  };

  render() {
    const { started, step } = this.state;

    const context = {
      steps: this.scenario.length,
      current: step + 1,
      onPrev: this.handlePrevious,
      onNext: this.handleNext,
      onFinish: this.handleFinish,
      onSkip: this.handleSkip
    };

    return started ? (
      <View
        style={{ position: 'absolute', height: '100%', width: '100%' }}
        pointerEvents="box-none"
      >
        <WalkthroughStep step={this.scenario[step]} context={context} />
      </View>
    ) : null;
  }
}

const walkthroughRef = React.createRef();

const startWalkthrough = ({ scenario }) => {
  if (walkthroughRef.current) walkthroughRef.current.launch({ scenario });
};

export { startWalkthrough };
export default props => <Walkthrough ref={walkthroughRef} {...props} />;
