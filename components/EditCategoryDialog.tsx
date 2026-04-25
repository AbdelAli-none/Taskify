"use client";

import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { RootState } from "@/lib/features/store";
import {
  editCategoryDialogOpen,
  mainDialogOpen,
} from "@/lib/features/ui/uiSlice";
import { categoriesColors, categoriesIcons } from "@/src/app/data";
import { updateCategory } from "@/src/app/actions/category/updateCategory";
import { Spinner } from "./ui/spinner";

export interface ICategoryToUpdate {
  name: string;
  iconCategory: string;
  color: string;
}

export const EditCategoryDialog = () => {
  const router = useRouter();
  const categoryToEdit = useSelector((state: RootState) => state.categorySlice);
  const { id, name, color, icon } = categoryToEdit || {};
  const [categoryTitle, setCategoryTitle] = useState(name ?? "");
  const [categoryIcon, setCategoryIcon] = useState(icon ?? "");
  const [categoryColor, setCategoryColor] = useState(color ?? "");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (categoryToEdit) {
      setCategoryTitle(categoryToEdit.name);
      setCategoryIcon(categoryToEdit.icon);
      setCategoryColor(categoryToEdit.color);
    }
  }, [categoryToEdit]);

  const hasChanges =
    categoryTitle !== name || categoryIcon !== icon || categoryColor !== color;

  const updatedCategory: ICategoryToUpdate = {
    name: categoryTitle.trim(),
    iconCategory: categoryIcon,
    color: categoryColor,
  };

  const dispatch = useDispatch();

  const isOpen = useSelector(
    (state: RootState) => state.openCloseSlice.isEditCategoryDialogOpen,
  );

  const handleUpdate = async () => {
    if (!id || !categoryTitle.trim()) {
      toast.error("Category name is required");
      return;
    }

    setIsLoading(true);

    try {
      toast.promise(updateCategory(Number(id), updatedCategory), {
        loading: "Updating category...",
        success: "Category updated successfully",
        error: (err) => err?.message || "Failed to update category",
      });

      router.refresh();
      setCategoryTitle("");
      setCategoryIcon("");
      setCategoryColor("");

      // Close dialog on success
      dispatch(editCategoryDialogOpen(false));
      // dispatch(mainDialogOpen(false));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => dispatch(editCategoryDialogOpen(open))}
    >
      <form>
        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle>Edit Your Category</DialogTitle>
            <DialogDescription>
              Make your category expressive as much as possible.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="categoryLabel">Label</Label>
              <Input
                value={categoryTitle}
                onChange={(e) => {
                  setCategoryTitle(e.target.value);
                }}
                id="categoryLabel"
                type="text"
                placeholder="Your Category!"
                className="placeholder:text-sm text-sm"
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="categoryIcon">Category Icon</Label>
              <div className="flex flex-wrap gap-1">
                {categoriesIcons.map((categoryIconItem, idx) => (
                  <Button
                    key={idx}
                    onClick={() => setCategoryIcon(categoryIconItem)}
                    className={`w-fit bg-gray-200 p-3 ${categoryIconItem === categoryIcon ? "bg-blue-400" : ""}`}
                  >
                    {categoryIconItem}
                  </Button>
                ))}
              </div>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="categoryResult">Category Color</Label>
              <div className="flex flex-wrap justify-start gap-2">
                {categoriesColors.map((defaultCategorycolor, idx) => (
                  <Button
                    key={idx}
                    onClick={() => {
                      setCategoryColor(defaultCategorycolor);
                    }}
                    className={`w-7 h-7 rounded-full hover:scale-110 cursor-pointer duration-200 p-0 ${defaultCategorycolor === categoryColor ? "scale-125" : ""}`}
                    style={{
                      backgroundColor: defaultCategorycolor,
                    }}
                  ></Button>
                ))}
              </div>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="categoryResult">Updated Category</Label>
              <Input
                value={categoryIcon + categoryTitle}
                readOnly
                id="categoryResult"
                type="text"
                className="text-[15px]! outline-none! border-none! focus-visible:ring-0!"
                style={{ backgroundColor: categoryColor }}
              />
            </div>
          </div>
          <DialogFooter className="bg-transparent border-none">
            <DialogClose asChild>
              <Button
                variant="outline"
                onClick={() => {
                  setCategoryTitle(String(name));
                  setCategoryIcon(String(icon));
                  setCategoryColor(String(color));
                }}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              className="bg-blue-500 px-8 rounded-md hover:bg-blue-600 duration-200"
              disabled={!hasChanges || isLoading || !categoryTitle.trim()}
              type="button"
              onClick={handleUpdate}
            >
              {isLoading ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Updating...
                </>
              ) : (
                "Update Category"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};
