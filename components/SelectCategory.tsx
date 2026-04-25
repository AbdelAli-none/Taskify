"use client";

import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import { Pencil, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, SetStateAction, useState } from "react";
import { ICategory, ITodo } from "@/interfaces";
import { Spinner } from "./ui/spinner";
import {
  deleteCategoryDialog,
  editCategoryDialogOpen,
  isAddCategoryDialogOpen,
  mainDialogOpen,
} from "@/lib/features/ui/uiSlice";
import { categoryToEdit } from "@/lib/features/category/categorySlice";
import { deleteCategory } from "@/src/app/actions/category/deleteCategory";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { toast } from "sonner";
import { RootState } from "@/lib/features/store";

interface SelectCategoryProps {
  loading: boolean;
  categories?: ICategory[];
  onSelect?: (id: number) => void;
  selectedCategory?: ICategory;
  setUpdateToDo?: Dispatch<SetStateAction<ITodo>>;
}

export const SelectCategory = ({
  loading,
  categories,
  onSelect,
  selectedCategory,
  setUpdateToDo,
}: SelectCategoryProps) => {
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
  const dispatch = useDispatch();
  const SP = "\u00A0".repeat(5);
  const SP2 = "\u00A0".repeat(2);

  const isOpen = useSelector(
    (state: RootState) => state.openCloseSlice.isDeleteCategoryDialogOpen,
  );

  if (loading) {
    return (
      <div className="flex w-full items-center gap-1.5 rounded-lg border border-input bg-transparent py-1.5 pr-2 pl-2.5 text-sm whitespace-nowrap transition-colors outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-placeholder:text-muted-foreground data-[size=default]:h-8 data-[size=sm]:h-7 data-[size=sm]:rounded-[min(var(--radius-md),10px)] *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
        {" "}
        <Spinner />
        <p>Loading categories List...</p>
      </div>
    );
  }

  const { id } = selectedCategory || {};

  return (
    <>
      <Select
        value={id ? String(id) : undefined}
        onValueChange={(value) => {
          const id = Number(value);
          if (onSelect) onSelect(id);
          const selected = categories?.find((c) => c.id === id);
          if (selected && setUpdateToDo) {
            setUpdateToDo((prev: ITodo) => ({
              ...prev,
              category: {
                ...prev.category,
                id: selected.id,
                name: selected.name,
                iconCategory: selected.iconCategory,
                color: selected.color,
              },
            }));
          }
        }}
      >
        <SelectTrigger className="w-full ps-0!">
          <SelectValue
            placeholder={
              categories?.length === 0
                ? `${SP2}✨ Create your first category...`
                : `${SP}eg: 💼Work, 🏠Personal, 🏋️Health, 📚Learning`
            }
          />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectGroup>
            {categories && categories.length > 0 && (
              <SelectLabel>Mark Your Category</SelectLabel>
            )}
            <AnimatePresence>
              {categories?.length ? (
                categories.map((category) => {
                  const { iconCategory, color, name, id } = category;
                  const categoryId = `${id}`;
                  return (
                    <motion.div
                      key={category.name}
                      layout
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                      exit={{ opacity: 0, y: 20, scale: 0.95 }}
                      className="flex flex-col justify-between items-center gap-x-1"
                    >
                      <div className="flex justify-between w-full items-center">
                        <SelectItem
                          className={`flex justify-start items-center`}
                          value={categoryId}
                        >
                          <span
                            className="text-[18px] p-1 rounded-tr-xl rounded-br-xl"
                            style={{ backgroundColor: color }}
                          >
                            {iconCategory}
                          </span>
                          <span>{name}</span>
                        </SelectItem>

                        <Button
                          onClick={() => {
                            dispatch(editCategoryDialogOpen(true));
                            dispatch(
                              categoryToEdit({
                                id: String(id),
                                color,
                                name,
                                icon: iconCategory,
                              }),
                            );
                          }}
                          className="bg-orange-500 hover:bg-orange-400"
                        >
                          <Pencil /> {/* Edit */}
                        </Button>
                        <Button
                          onClick={() => {
                            setCategoryToDelete(category.id);
                            dispatch(deleteCategoryDialog(true));
                          }}
                          className="bg-red-500 hover:bg-red-400"
                        >
                          <Trash2 /> {/* Delete */}
                        </Button>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  exit={{ opacity: 0, y: 20, scale: 0.95 }}
                  className="flex flex-col items-center"
                >
                  <SelectLabel className="opacity-50">
                    No categories found
                  </SelectLabel>
                  <div className="flex w-full max-w-sm items-center gap-2">
                    <Button
                      onClick={() => {
                        dispatch(isAddCategoryDialogOpen(true));
                      }}
                      type="submit"
                      variant="outline"
                      className="bg-blue-500 px-8 w-[75%] mx-auto rounded-md hover:bg-blue-600 duration-200 text-background"
                    >
                      ADD
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <motion.div
              layout
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="flex flex-col items-center"
            >
              <SelectLabel>
                Your Category Not Available, Create Yours
              </SelectLabel>
              <div className="flex w-full max-w-sm items-center gap-2">
                <Button
                  onClick={() => {
                    dispatch(isAddCategoryDialogOpen(true));
                  }}
                  type="submit"
                  variant="outline"
                  className="bg-blue-500 px-8 w-[75%] mx-auto rounded-md hover:bg-blue-600 duration-200 text-foreground"
                >
                  ADD
                </Button>
              </div>
            </motion.div>
          </SelectGroup>
        </SelectContent>
      </Select>

      <AlertDialog
        open={isOpen}
        onOpenChange={(open) => dispatch(deleteCategoryDialog(open))}
      >
        <AlertDialogContent className="gap-0">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="">
                This action will remove all todos related to that category
              </span>
              <span className="block w-fit rounded-md mt-4 text-white bg-red-500 p-1">
                This action cannot be undone.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="bg-transparent border-none">
            <AlertDialogCancel onClick={() => setCategoryToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-blue-500! px-8 rounded-md hover:bg-blue-600! duration-200"
              onClick={() => {
                if (!categoryToDelete) return;

                toast.promise(deleteCategory(categoryToDelete), {
                  loading: "deleting category...",
                  success: () => {
                    setCategoryToDelete(null);
                    return "category has been deleted...";
                  },
                  error: "failed to delete category",
                });
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
