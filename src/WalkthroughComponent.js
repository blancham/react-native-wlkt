import React from 'react';

const _components = {};

const getComponents = () => {
  return _components;
};

const WalkthroughComponent = ({ children, id, ...props }) =>
  React.cloneElement(children, {
    ref: reference => {
      _components[id] = reference;
    },
    ...props,
  });

export { WalkthroughComponent, getComponents };
