import { orderReducer, createOrder, clearOrder } from './orderSlice';
import { TOrder } from '@utils-types';

const mockOrder: TOrder = {
  _id: 'order1',
  status: 'done',
  name: 'Test Order',
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z',
  number: 12345,
  ingredients: ['ing1', 'ing2']
};

describe('order slice', () => {
  const initialState = {
    order: null,
    loading: false,
    error: null
  };

  it('should return initial state', () => {
    expect(orderReducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('should handle createOrder.pending', () => {
    const action = { type: createOrder.pending.type };
    const state = orderReducer(initialState, action);

    expect(state.loading).toBe(true);
    expect(state.error).toBe(null);
  });

  it('should handle createOrder.fulfilled', () => {
    const action = {
      type: createOrder.fulfilled.type,
      payload: mockOrder
    };
    const state = orderReducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.order).toEqual(mockOrder);
    expect(state.error).toBe(null);
  });

  it('should handle createOrder.rejected', () => {
    const errorMessage = 'Failed to create order';
    const action = {
      type: createOrder.rejected.type,
      error: { message: errorMessage }
    };
    const state = orderReducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
    expect(state.order).toBe(null);
  });

  it('should handle clearOrder', () => {
    const stateWithOrder = {
      order: mockOrder,
      loading: false,
      error: 'Some error'
    };

    const action = clearOrder();
    const state = orderReducer(stateWithOrder, action);

    expect(state.order).toBe(null);
    expect(state.error).toBe(null);
  });
});
