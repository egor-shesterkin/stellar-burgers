import { store } from './store';

describe('store configuration', () => {
  it('should be configured with all required reducers', () => {
    const state = store.getState();

    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('burgerConstructor');
    expect(state).toHaveProperty('order');
    expect(state).toHaveProperty('auth');
    expect(state).toHaveProperty('feed');
    expect(state).toHaveProperty('userOrders');
  });

  it('should have correct initial state for all slices', () => {
    const state = store.getState();

    // Ingredients slice
    expect(state.ingredients).toEqual({
      ingredients: [],
      loading: false,
      error: null
    });

    // Constructor slice
    expect(state.burgerConstructor).toEqual({
      bun: null,
      ingredients: []
    });

    // Order slice
    expect(state.order).toEqual({
      order: null,
      loading: false,
      error: null
    });

    // Auth slice
    expect(state.auth).toEqual({
      user: null,
      loading: false,
      error: null
    });

    // Feed slice
    expect(state.feed).toEqual({
      orders: [],
      total: 0,
      totalToday: 0,
      loading: false,
      error: null
    });

    // User Orders slice
    expect(state.userOrders).toEqual({
      orders: [],
      loading: false,
      error: null
    });
  });

  it('should handle actions without mutating state for unknown actions', () => {
    const initialState = store.getState();

    store.dispatch({ type: 'UNKNOWN_ACTION' });

    const newState = store.getState();

    expect(newState).toEqual(initialState);
  });
});
