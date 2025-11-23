import { feedReducer, getFeeds, clearFeedError } from './feedSlice';
import { TOrder } from '../../utils/types';

const mockOrders: TOrder[] = [
  {
    _id: 'order1',
    status: 'done',
    name: 'Test Order 1',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
    number: 12345,
    ingredients: ['ing1', 'ing2']
  },
  {
    _id: 'order2',
    status: 'pending',
    name: 'Test Order 2',
    createdAt: '2023-01-02T00:00:00.000Z',
    updatedAt: '2023-01-02T00:00:00.000Z',
    number: 12346,
    ingredients: ['ing3', 'ing4']
  }
];

const mockFeedsResponse = {
  orders: mockOrders,
  total: 100,
  totalToday: 10
};

describe('feed slice', () => {
  const initialState = {
    orders: [],
    total: 0,
    totalToday: 0,
    loading: false,
    error: null
  };

  it('should return initial state', () => {
    expect(feedReducer(undefined, { type: '' })).toEqual(initialState);
  });

  describe('getFeeds async actions', () => {
    it('should handle getFeeds.pending', () => {
      const action = { type: getFeeds.pending.type };
      const state = feedReducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });

    it('should handle getFeeds.fulfilled', () => {
      const action = {
        type: getFeeds.fulfilled.type,
        payload: mockFeedsResponse
      };
      const state = feedReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.orders).toEqual(mockOrders);
      expect(state.total).toBe(100);
      expect(state.totalToday).toBe(10);
      expect(state.error).toBe(null);
    });

    it('should handle getFeeds.rejected with error message', () => {
      const errorMessage = 'Failed to fetch feeds';
      const action = {
        type: getFeeds.rejected.type,
        error: { message: errorMessage }
      };
      const state = feedReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.orders).toEqual([]);
      expect(state.total).toBe(0);
      expect(state.totalToday).toBe(0);
    });

    it('should handle getFeeds.rejected with payload (rejectWithValue)', () => {
      const errorMessage = 'Network error';
      const action = {
        type: getFeeds.rejected.type,
        payload: errorMessage
      };
      const state = feedReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Failed to fetch feeds'); // Default fallback
      expect(state.orders).toEqual([]);
    });

    it('should handle getFeeds.rejected with undefined error', () => {
      const action = {
        type: getFeeds.rejected.type,
        error: undefined
      };
      const state = feedReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Failed to fetch feeds'); // Default fallback
      expect(state.orders).toEqual([]);
    });
  });

  describe('clearFeedError action', () => {
    it('should clear error state', () => {
      const stateWithError = {
        orders: [],
        total: 0,
        totalToday: 0,
        loading: false,
        error: 'Some error message'
      };

      const action = clearFeedError();
      const state = feedReducer(stateWithError, action);

      expect(state.error).toBe(null);
    });

    it('should not affect other state properties when clearing error', () => {
      const stateWithData = {
        orders: mockOrders,
        total: 50,
        totalToday: 5,
        loading: false,
        error: 'Some error'
      };

      const action = clearFeedError();
      const state = feedReducer(stateWithData, action);

      expect(state.error).toBe(null);
      expect(state.orders).toEqual(mockOrders);
      expect(state.total).toBe(50);
      expect(state.totalToday).toBe(5);
      expect(state.loading).toBe(false);
    });
  });

  it('should maintain state for unknown actions', () => {
    const stateWithData = {
      orders: mockOrders,
      total: 100,
      totalToday: 10,
      loading: false,
      error: null
    };

    const action = { type: 'UNKNOWN_ACTION' };
    const state = feedReducer(stateWithData, action);

    expect(state).toEqual(stateWithData);
  });

  describe('state transitions', () => {
    it('should transition correctly from pending to fulfilled', () => {
      let state = feedReducer(initialState, { type: getFeeds.pending.type });
      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);

      state = feedReducer(state, {
        type: getFeeds.fulfilled.type,
        payload: mockFeedsResponse
      });

      expect(state.loading).toBe(false);
      expect(state.orders).toEqual(mockOrders);
      expect(state.total).toBe(100);
      expect(state.totalToday).toBe(10);
      expect(state.error).toBe(null);
    });

    it('should transition correctly from pending to rejected', () => {
      let state = feedReducer(initialState, { type: getFeeds.pending.type });
      expect(state.loading).toBe(true);

      state = feedReducer(state, {
        type: getFeeds.rejected.type,
        error: { message: 'Error occurred' }
      });

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Error occurred');
      expect(state.orders).toEqual([]);
    });
  });
});
