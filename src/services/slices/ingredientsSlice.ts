import {
  createSlice,
  createAsyncThunk,
  createSelector
} from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { getIngredientsApi } from '@api';
import { RootState } from '../store';

export const getIngredients = createAsyncThunk(
  'ingredients/getAll',
  getIngredientsApi
);

type TIngredientsState = {
  ingredients: TIngredient[];
  loading: boolean;
  error: string | null;
};

const initialState: TIngredientsState = {
  ingredients: [],
  loading: false,
  error: null
};

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.ingredients = action.payload;
      })
      .addCase(getIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch ingredients';
      });
  }
});

export const ingredientsSelector = (state: RootState) =>
  state.ingredients.ingredients;

export const bunsSelector = createSelector(
  [ingredientsSelector],
  (ingredients: TIngredient[]) =>
    ingredients.filter((ingredient) => ingredient.type === 'bun')
);

export const mainsSelector = createSelector(
  [ingredientsSelector],
  (ingredients: TIngredient[]) =>
    ingredients.filter((ingredient) => ingredient.type === 'main')
);

export const saucesSelector = createSelector(
  [ingredientsSelector],
  (ingredients: TIngredient[]) =>
    ingredients.filter((ingredient) => ingredient.type === 'sauce')
);

export const ingredientsReducer = ingredientsSlice.reducer;
