import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  isMainDialogOpen: boolean;
  isEditCategoryDialogOpen: boolean;
  isAddCategoryDialogOpen: boolean;
  isDeleteCategoryDialogOpen: boolean;
}

const initialState: UIState = {
  isMainDialogOpen: false,
  isEditCategoryDialogOpen: false,
  isAddCategoryDialogOpen: false,
  isDeleteCategoryDialogOpen: false,
};

export const openCloseSlice = createSlice({
  name: "openClose",
  initialState,
  reducers: {
    mainDialogOpen: (state, action: PayloadAction<boolean>) => {
      state.isMainDialogOpen = action.payload;
    },
    editCategoryDialogOpen: (state, action: PayloadAction<boolean>) => {
      state.isEditCategoryDialogOpen = action.payload;
    },
    isAddCategoryDialogOpen: (state, action: PayloadAction<boolean>) => {
      state.isAddCategoryDialogOpen = action.payload;
    },
    deleteCategoryDialog: (state, action: PayloadAction<boolean>) => {
      state.isDeleteCategoryDialogOpen = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  mainDialogOpen,
  editCategoryDialogOpen,
  isAddCategoryDialogOpen,
  deleteCategoryDialog,
} = openCloseSlice.actions;

export default openCloseSlice.reducer;
