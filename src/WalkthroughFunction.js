import React from 'react';

const tooltipPlacement = [
  'topleft',
  'top',
  'topright',

  'lefttop',
  'left',
  'leftbottom',

  'righttop',
  'right',
  'rightbottom',

  'bottomleft',
  'bottom',
  'bottomright'
];

const measureAsync = async ({ component }) => {
  return new Promise((resolve, reject) => {
    try {
      if (component && component.measureInWindow)
        component.measureInWindow((x, y, width, height) => {
          resolve({ x, y, width, height });
        });
      setTimeout(() => {
        resolve({ x: 0, y: 0, width: 0, height: 0 });
      }, 500);
    } catch (error) {
      reject(error);
    }
  });
};

const measureComponent = async ({ component }) => {
  const measurements = await measureAsync({ component });
  const layout = {
    x: measurements.x,
    y: measurements.y,
    width: measurements.width,
    height: measurements.height
  };

  return layout;
};

const compare = (obj1, obj2) => {
  if (!obj1 || !obj2) return false;
  return (
    Object.keys(obj1).every(key => {
      if (!Object.prototype.hasOwnProperty.call(obj2, key)) return false;
      switch (typeof obj1[key]) {
        case 'object':
          if (obj1[key] === null) {
            if (obj2[key] !== null) return false;
          } else if (!compare(obj1[key], obj2[key])) return false;
          break;
        case 'function':
          if (
            typeof obj2[key] === 'undefined' ||
            obj1[key].toString() !== obj2[key].toString()
          )
            return false;
          break;
        default:
          if (obj1[key] !== obj2[key]) return false;
      }
      return true;
    }) &&
    Object.keys(obj2).every(key => {
      if (typeof obj1[key] === 'undefined') return false;
      return true;
    })
  );
};

export function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

const mergeObject = (obj1, obj2) => {
  const output = {};
  const fill = obj => {
    Object.keys(obj).forEach(key => {
      if (isObject(obj[key])) output[key] = { ...output[key], ...obj[key] };
      else if (obj[key]) output[key] = obj[key];
    });
  };

  if (isObject(obj1) && isObject(obj2)) {
    fill(obj1);
    fill(obj2);
  }
  return output;
};

const isValidSpotlight = position => {
  const { top, left, width, height } = position || {};

  return top >= 0 && left >= 0 && width > 0 && height > 0;
};

const minValue = (value1, value2) => (value1 < value2 ? value1 : value2);
const maxValue = (value1, value2) => (value1 > value2 ? value1 : value2);

const validObject = object => object !== null && object !== undefined;

const ifAvailable = (callback, params) =>
  typeof callback === 'function' ? callback(params) : true;

const formatOptions = (options = {}, defaultOptions) => {
  if (!validObject(defaultOptions)) return null;
  const newOptions = {};

  Object.keys(defaultOptions).forEach(key => {
    if (
      typeof defaultOptions[key] === 'object' &&
      defaultOptions[key].value === undefined
    ) {
      newOptions[key] = formatOptions(options[key], defaultOptions[key]);
    } else {
      const otype = typeof options[key];
      const dtype =
        typeof defaultOptions[key].type === 'string'
          ? [defaultOptions[key].type]
          : defaultOptions[key].type;

      newOptions[key] = defaultOptions[key].value;
      if (
        options[key] !== undefined &&
        dtype instanceof Array &&
        dtype.length > 0
      )
        if (dtype.includes('any') || dtype.includes(otype))
          if (ifAvailable(defaultOptions[key].valid, options[key]))
            newOptions[key] = options[key];
    }
  });
  return newOptions;
};

const validScenario = scenario =>
  scenario instanceof Array &&
  scenario !== null &&
  scenario !== undefined &&
  scenario.length > 0;

const mergeScenario = (originalScenario, newScenario, step) => {
  const scenario = [
    ...originalScenario.slice(0, step + 1),
    ...newScenario,
    ...originalScenario.slice(step + 1)
  ];

  return scenario.filter((item, index) => {
    if (compare(item, scenario[index + 1])) return false;
    return true;
  });
};

export {
  measureComponent,
  measureAsync,
  compare,
  mergeObject,
  isValidSpotlight,
  minValue,
  maxValue,
  ifAvailable,
  formatOptions,
  mergeScenario,
  validScenario,
  tooltipPlacement
};
