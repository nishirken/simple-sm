type Key = string | number;
type TransitToStates<T extends Key> = Readonly<T[]>;
export type StatesDescription<T extends Key> = Readonly<Record<T, TransitToStates<T>>>;

interface Params {
  assertLevel?: 'warning' | 'error';
}

interface NextState<T> {
  state: T;
  tryTransitTo(...states: T[]): NextState<T>;
}

const nextStateError = <T extends Key>(currentState: T, nextState: T, availableStates: TransitToStates<T>) => {
  return `You are trying to transit to state: ${nextState}.\n` +
    `But for state: ${currentState} available states are ${availableStates}`;
};

const makeState = <T extends Key>(current: T, states: StatesDescription<T>, params: Params): NextState<T> => {
  return {
    state: current,
    tryTransitTo: (...nextStates: T[]) => {
      for (const nextState of nextStates) {
        const cantTransitTo = states[nextState];
        if (states[current].includes(nextState)) {
          return makeState(nextState, states, params);
        } else if (params.assertLevel === 'warning') {
          console.warn(nextStateError<T>(current, nextState, cantTransitTo));
        } else if (params.assertLevel === 'error') {
          throw new Error(nextStateError<T>(current, nextState, cantTransitTo));
        }

        return makeState(current, states, params);
      }
    },
  };
};

export const initState = <T extends Key>(initialState: T, states: StatesDescription<T>, params: Params = {}): NextState<T> => {
  if (Object.keys(states).length === 0) {
    throw new Error('States are empty');
  }
  return makeState<T>(initialState, states, params);
};
