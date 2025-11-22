import {
  userOrdersReducer,
  getUserOrders,
  clearUserOrdersError
} from './userOrdersSlice';
import { TOrder } from '../../utils/types';

const mockUserOrders: TOrder[] = [
  {
    _id: 'user_order1',
    status: 'done',
    name: 'User Order 1',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
    number: 12345,
    ingredients: ['ing1', 'ing2']
  },
  {
    _id: 'user_order2',
    status: 'created',
    name: 'User Order 2',
    createdAt: '2023-01-02T00:00:00.000Z',
    updatedAt: '2023-01-02T00:00:00.000Z',
    number: 12346,
    ingredients: ['ing3', 'ing4']
  },
  {
    _id: 'user_order3',
    status: 'pending',
    name: 'User Order 3',
    createdAt: '2023-01-03T00:00:00.000Z',
    updatedAt: '2023-01-03T00:00:00.000Z',
    number: 12347,
    ingredients: ['ing5', 'ing6']
  }
];

describe('userOrders slice', () => {
  const initialState = {
    orders: [],
    loading: false,
    error: null
  };

  it('should return initial state', () => {
    expect(userOrdersReducer(undefined, { type: '' })).toEqual(initialState);
  });

  describe('getUserOrders async actions', () => {
    it('should handle getUserOrders.pending', () => {
      const action = { type: getUserOrders.pending.type };
      const state = userOrdersReducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });

    it('should handle getUserOrders.fulfilled', () => {
      const action = {
        type: getUserOrders.fulfilled.type,
        payload: mockUserOrders
      };
      const state = userOrdersReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.orders).toEqual(mockUserOrders);
      expect(state.error).toBe(null);
    });

    it('should handle getUserOrders.rejected with error message', () => {
      const errorMessage = 'Failed to fetch user orders';
      const action = {
        type: getUserOrders.rejected.type,
        error: { message: errorMessage }
      };
      const state = userOrdersReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.orders).toEqual([]);
    });

    it('should handle getUserOrders.rejected with payload (rejectWithValue)', () => {
      const errorMessage = 'Authentication failed';
      const action = {
        type: getUserOrders.rejected.type,
        payload: errorMessage
      };
      const state = userOrdersReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Failed to fetch user orders'); // Default fallback
      expect(state.orders).toEqual([]);
    });

    it('should handle getUserOrders.rejected with undefined error', () => {
      const action = {
        type: getUserOrders.rejected.type,
        error: undefined
      };
      const state = userOrdersReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Failed to fetch user orders'); // Default fallback
      expect(state.orders).toEqual([]);
    });
  });

  describe('clearUserOrdersError action', () => {
    it('should clear error from state', () => {
      const stateWithError = {
        orders: [],
        loading: false,
        error: 'Some error occurred'
      };

      const action = clearUserOrdersError();
      const state = userOrdersReducer(stateWithError, action);

      expect(state.error).toBe(null);
      expect(state.orders).toEqual([]);
      expect(state.loading).toBe(false);
    });

    it('should preserve orders when clearing error', () => {
      const stateWithDataAndError = {
        orders: mockUserOrders,
        loading: false,
        error: 'Temporary error'
      };

      const action = clearUserOrdersError();
      const state = userOrdersReducer(stateWithDataAndError, action);

      expect(state.error).toBe(null);
      expect(state.orders).toEqual(mockUserOrders);
      expect(state.loading).toBe(false);
    });

    it('should work when there is no error', () => {
      const stateWithoutError = {
        orders: mockUserOrders,
        loading: false,
        error: null
      };

      const action = clearUserOrdersError();
      const state = userOrdersReducer(stateWithoutError, action);

      expect(state.error).toBe(null);
      expect(state.orders).toEqual(mockUserOrders);
    });
  });

  describe('state integrity', () => {
    it('should not modify state for unknown actions', () => {
      const currentState = {
        orders: mockUserOrders,
        loading: false,
        error: null
      };

      const action = { type: 'SOME_UNKNOWN_ACTION' };
      const state = userOrdersReducer(currentState, action);

      expect(state).toEqual(currentState);
    });

    it('should handle multiple state transitions correctly', () => {
      // Start with initial state
      let state = userOrdersReducer(initialState, {
        type: getUserOrders.pending.type
      });
      expect(state.loading).toBe(true);
      expect(state.orders).toEqual([]);

      // Add some orders
      state = userOrdersReducer(state, {
        type: getUserOrders.fulfilled.type,
        payload: [mockUserOrders[0]]
      });
      expect(state.loading).toBe(false);
      expect(state.orders).toHaveLength(1);

      // Add error
      state = userOrdersReducer(state, {
        type: getUserOrders.rejected.type,
        error: { message: 'New error' }
      });
      expect(state.error).toBe('New error');
      expect(state.orders).toHaveLength(1); // Orders should persist

      // Clear error
      state = userOrdersReducer(state, clearUserOrdersError());
      expect(state.error).toBe(null);
      expect(state.orders).toHaveLength(1);
    });
  });

  describe('edge cases', () => {
    it('should handle empty orders array', () => {
      const action = {
        type: getUserOrders.fulfilled.type,
        payload: []
      };
      const state = userOrdersReducer(initialState, action);

      expect(state.orders).toEqual([]);
      expect(state.loading).toBe(false);
      expect(state.error).toBe(null);
    });

    it('should handle rejected action with undefined error', () => {
      const action = {
        type: getUserOrders.rejected.type,
        error: { message: undefined }
      };
      const state = userOrdersReducer(initialState, action);

      expect(state.error).toBe('Failed to fetch user orders'); // Default fallback
      expect(state.loading).toBe(false);
    });
  });
});
