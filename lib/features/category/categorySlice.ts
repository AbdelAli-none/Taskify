import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ICategoryToEdit {
  id: string;
  name: string;
  icon: string;
  color: string;
}

const initialState: ICategoryToEdit | null = null;

export const categorySlice = createSlice({
  name: "categorySlice",
  initialState: null as ICategoryToEdit | null,
  reducers: {
    categoryToEdit: (state, action: PayloadAction<ICategoryToEdit>) => {
      return action.payload;
    },
    clearCategoryToEdit: () => null,
  },
});

export const { categoryToEdit, clearCategoryToEdit } = categorySlice.actions;
export default categorySlice.reducer;
