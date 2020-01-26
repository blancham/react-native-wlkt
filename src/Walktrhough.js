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
  component: { value: null, valid: v => typeof v === 'string' },
  onNextIn: { value: null, valid: v => typeof v === 'function' },
  onNextOut: { value: null, valid: v => typeof v === 'function' },
  onPrevIn: { value: null, valid: v => typeof v === 'function' },
  onPrevOut: { value: null, valid: v => typeof v === 'function' },
  spotlightOptions: {
    borderWidth: { value: 0, valid: v => v >= 0 },
    borderRadius: { value: 0, valid: v => v >= 0 },
    borderColor: { value: 'orange', valid: v => typeof v === 'string' },
    padding: { value: 0, valid: v => v >= 0 },
    clickThrough: { value: false, valid: v => typeof v === 'boolean' }
  },
  overlayOptions: {
    backgroundColor: { value: 'black', valid: v => typeof v === 'string' },
    diagonalBuffer: { value: 10, valid: v => v >= 0 },
    opacity: { value: 0.8, valid: v => v >= 0 && v <= 1 },
    onPress: { value: null, valid: v => typeof v === 'function' || v === null }
  },
  tooltipOptions: {
    height: { value: 100, valid: v => v > 0 },
    width: { value: 230, valid: v => v > 0 },
    content: { value: '', valid: v => typeof v === 'string' },
    borderRadius: { value: 10, valid: v => v >= 0 },
    backgroundColor: { value: 'white', valid: v => typeof v === 'string' },
    fontSize: { value: 15, valid: v => v >= 0 },
    placement: { value: null, valid: v => tooltipPlacement.includes(v) },
    offsetCenter: { value: 0, valid: v => typeof v === 'number' },
    offset: { value: 20, valid: v => typeof v === 'number' },
    tooltipComponent: { value: null }
  }
};

class WalkthroughComponent extends Component {
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
const Walkthrough = props => (
  <WalkthroughComponent ref={walkthroughRef} {...props} />
);

const startWalkthrough = ({ scenario }) => {
  if (walkthroughRef.current) walkthroughRef.current.launch({ scenario });
};

export { startWalkthrough };
export default Walkthrough;
