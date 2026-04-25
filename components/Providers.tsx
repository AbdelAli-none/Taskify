"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { Provider, useSelector } from "react-redux";
import store, { RootState } from "@/lib/features/store";
import { ThemeProvider } from "next-themes"; // if you want ThemeProvider also here
import DialogAddTodo from "./DialogAddTodo";
import { AddCategoryPage } from "./AddCategory";
import { EditCategoryDialog } from "./EditCategoryDialog";

function Modals() {
  const isOpen = useSelector(
    (state: RootState) => state.openCloseSlice.isMainDialogOpen,
  );

  return <>{isOpen && <DialogAddTodo />}</>;
}

function EditCategory() {
  const isOpen = useSelector(
    (state: RootState) => state.openCloseSlice.isEditCategoryDialogOpen,
  );

  return <>{isOpen && <EditCategoryDialog />}</>;
}

function AddCategoryDialog() {
  const isOpen = useSelector(
    (state: RootState) => state.openCloseSlice.isAddCategoryDialogOpen,
  );
  if (isOpen) {
    return <AddCategoryPage key={isOpen ? "open" : "close"} />;
  }
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <Provider store={store}>
        <ThemeProvider attribute="class" defaultTheme="system">
          {children}
          <Modals />
          <EditCategory />
          <AddCategoryDialog />
        </ThemeProvider>
      </Provider>
    </ClerkProvider>
  );
}
