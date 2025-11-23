import {
  constructorReducer,
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from './constructorSlice';
import { TIngredient } from '../../utils/types';

// Mock UUID
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mock-uuid-123')
}));

const mockBun: TIngredient = {
  _id: 'bun1',
  name: 'Test Bun',
  type: 'bun',
  proteins: 10,
  fat: 5,
  carbohydrates: 20,
  calories: 100,
  price: 200,
  image: 'bun.jpg',
  image_large: 'bun-large.jpg',
  image_mobile: 'bun-mobile.jpg'
};

const mockIngredient1: TIngredient = {
  _id: 'ing1',
  name: 'Test Ingredient 1',
  type: 'main',
  proteins: 5,
  fat: 3,
  carbohydrates: 10,
  calories: 50,
  price: 100,
  image: 'ing1.jpg',
  image_large: 'ing1-large.jpg',
  image_mobile: 'ing1-mobile.jpg'
};

describe('constructor slice', () => {
  const initialState = {
    bun: null,
    ingredients: []
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return initial state', () => {
    expect(constructorReducer(undefined, { type: '' })).toEqual(initialState);
  });

  describe('addBun', () => {
    it('should handle adding a bun', () => {
      const action = addBun(mockBun);
      const state = constructorReducer(initialState, action);

      expect(state.bun).toEqual(mockBun);
    });
  });

  describe('addIngredient', () => {
    it('should handle adding an ingredient with generated id', () => {
      const action = addIngredient(mockIngredient1);
      const state = constructorReducer(initialState, action);

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]).toEqual({
        ...mockIngredient1,
        id: 'mock-uuid-123'
      });
    });
  });

  describe('removeIngredient', () => {
    it('should handle removing an ingredient by id', () => {
      // Add an ingredient
      let state = constructorReducer(
        initialState,
        addIngredient(mockIngredient1)
      );
      const ingredientId = state.ingredients[0].id;

      // Remove ingredient
      const removeAction = removeIngredient(ingredientId);
      state = constructorReducer(state, removeAction);

      expect(state.ingredients).toHaveLength(0);
    });
  });

  describe('moveIngredient', () => {
    it('should handle moving ingredients', () => {
      const mockIngredient2: TIngredient = {
        ...mockIngredient1,
        _id: 'ing2'
      };

      // Add two ingredients
      let state = constructorReducer(
        initialState,
        addIngredient(mockIngredient1)
      );
      state = constructorReducer(state, addIngredient(mockIngredient2));

      // Move first ingredient to second position
      const moveAction = moveIngredient({ fromIndex: 0, toIndex: 1 });
      state = constructorReducer(state, moveAction);

      expect(state.ingredients[0]._id).toBe('ing2');
      expect(state.ingredients[1]._id).toBe('ing1');
    });
  });

  describe('clearConstructor', () => {
    it('should clear all ingredients and bun', () => {
      let state = constructorReducer(initialState, addBun(mockBun));
      state = constructorReducer(state, addIngredient(mockIngredient1));

      const clearAction = clearConstructor();
      state = constructorReducer(state, clearAction);

      expect(state.bun).toBeNull();
      expect(state.ingredients).toHaveLength(0);
    });
  });
});
