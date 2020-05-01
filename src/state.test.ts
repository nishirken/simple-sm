import { initState, StatesDescription } from './index';

describe('State', () => {
  enum State {
    Initial,
    InitialHovered,
    InitialFocused,
  }

  const statesDescription: StatesDescription<State> = {
    [State.Initial]: [State.InitialHovered],
    [State.InitialHovered]: [State.Initial, State.InitialFocused],
    [State.InitialFocused]: [State.Initial],
  };

  it('from initial', () => {
    const state = initState<State>(State.Initial, statesDescription);
    expect(state.tryTransitTo(State.InitialHovered).state).toBe(State.InitialHovered);
    expect(state.tryTransitTo(State.InitialFocused).state).toBe(State.Initial);
    expect(state.tryTransitTo(State.Initial).state).toBe(State.Initial);
  });

  it('from hovered', () => {
    const state = initState<State>(State.InitialHovered, statesDescription);
    expect(state.tryTransitTo(State.InitialFocused).state).toBe(State.InitialFocused);
    expect(state.tryTransitTo(State.Initial).state).toBe(State.Initial);
  });

  it('from focused', () => {
    const state = initState<State>(State.InitialFocused, statesDescription);
    expect(state.tryTransitTo(State.Initial).state).toBe(State.Initial);
    expect(state.tryTransitTo(State.InitialHovered).state).toBe(State.InitialFocused);
    expect(state.tryTransitTo(State.InitialFocused).state).toBe(State.InitialFocused);
  });

  it('throws exception if assertLevel is error', () => {
    try {
      expect(initState<State>(State.Initial, statesDescription, {assertLevel: 'error'}).tryTransitTo(State.InitialFocused));
    } catch (error) {
      expect(true).toBeTruthy();
    }
  });
});
