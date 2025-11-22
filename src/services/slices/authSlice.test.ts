import { authReducer, loginUser, getUser, clearError } from './authSlice';
import { TUser } from '@utils-types';

const mockUser: TUser = {
  email: 'test@example.com',
  name: 'Test User'
};

describe('auth slice', () => {
  const initialState = {
    user: null,
    loading: false,
    error: null
  };

  it('should return initial state', () => {
    expect(authReducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('should handle loginUser.pending', () => {
    const action = { type: loginUser.pending.type };
    const state = authReducer(initialState, action);

    expect(state.loading).toBe(true);
    expect(state.error).toBe(null);
  });

  it('should handle loginUser.fulfilled', () => {
    const action = {
      type: loginUser.fulfilled.type,
      payload: mockUser
    };
    const state = authReducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.user).toEqual(mockUser);
    expect(state.error).toBe(null);
  });

  it('should handle loginUser.rejected', () => {
    const errorMessage = 'Login failed';
    const action = {
      type: loginUser.rejected.type,
      payload: errorMessage
    };
    const state = authReducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
    expect(state.user).toBe(null);
  });

  it('should handle getUser.pending', () => {
    const action = { type: getUser.pending.type };
    const state = authReducer(initialState, action);

    expect(state.loading).toBe(true);
  });

  it('should handle getUser.fulfilled', () => {
    const action = {
      type: getUser.fulfilled.type,
      payload: mockUser
    };
    const state = authReducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.user).toEqual(mockUser);
  });

  it('should handle clearError', () => {
    const stateWithError = {
      user: null,
      loading: false,
      error: 'Some error'
    };

    const action = clearError();
    const state = authReducer(stateWithError, action);

    expect(state.error).toBe(null);
  });
});
