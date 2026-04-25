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
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/features/store";
import {
  isAddCategoryDialogOpen,
  mainDialogOpen,
} from "@/lib/features/ui/uiSlice";
import { categoriesColors, categoriesIcons } from "@/src/app/data";
import { addCategory } from "@/src/app/actions/category/addCategory";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";

export const AddCategoryPage = () => {
  const [newCategoryName, setNewCategoryName] = useState<string>("");
  const [newCategoryIcon, setNewCategoryIcon] = useState<string>("");
  const [newCategoryColor, setNewCategoryColor] = useState<string>("");

  const [isSelectedIcon, setIsSelectedIcon] = useState<number | null>(null);
  const [isSelectedColor, setIsSelectedColor] = useState<number | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const dispatch = useDispatch();
  const isAddCategoryOpen = useSelector(
    (state: RootState) => state.openCloseSlice.isAddCategoryDialogOpen,
  );

  // const handleAddCategory = async () => {
  //   const newCategory = {
  //     name: newCategoryName,
  //     color: newCategoryColor,
  //     iconCategory: newCategoryIcon,
  //   };
  //   setIsLoading(true);
  //   await addCategory(newCategory);
  //   setIsLoading(false);
  //   dispatch(mainDialogOpen(false));
  //   dispatch(isAddCategoryDialogOpen(false));
  // };

  const handleAddCategory = async () => {
    setIsLoading(true);

    const promise = addCategory({
      name: newCategoryName,
      color: newCategoryColor,
      iconCategory: newCategoryIcon,
    });

    toast.promise(promise, {
      loading: "Creating your category...",
      success: (result) => {
        if (result.success === false) {
          throw new Error(result.error);
        }
        setNewCategoryName("");
        setNewCategoryColor("");
        setNewCategoryIcon("");
        dispatch(isAddCategoryDialogOpen(false));

        return `Category "${result.data?.name}" created!`;
      },
      error: (err) => {
        return err.message || "Failed to create category";
      },
      finally: () => {
        setIsLoading(false);
      },
    });
  };

  return (
    <Dialog
      open={isAddCategoryOpen}
      onOpenChange={(open) => dispatch(isAddCategoryDialogOpen(open))}
    >
      <DialogContent className="sm:max-w-106.25 pb-2 space-y-1">
        <DialogHeader className="text-center!">
          <DialogTitle>Create New Category</DialogTitle>
          <DialogDescription>
            Add a new category to organize your tasks.
          </DialogDescription>
        </DialogHeader>
        <form
          noValidate
          onSubmit={(e) => e.preventDefault()}
          className="my-4"
        >
          <div className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="categoryLabel">Label</Label>
              <Input
                onChange={(e) => {
                  const { target } = e;
                  setNewCategoryName(target.value);
                }}
                value={newCategoryName}
                id="categoryLabel"
                type="text"
                placeholder="New Category!"
                className="placeholder:text-sm text-sm"
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="categoryIcon">Category Icon</Label>
              <div className="flex flex-wrap justify-start gap-1.5">
                {categoriesIcons.map((category, idx) => (
                  <Button
                    onClick={() => {
                      setNewCategoryIcon(category);
                      setIsSelectedIcon(idx);
                    }}
                    key={idx}
                    className={`w-10.25 bg-background p-2.5 border border-gray-200 dark:border-primary cursor-pointer duration-200 ${isSelectedIcon === idx && "bg-blue-500 border-none"}`}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="categoryResult">Category Color</Label>
              <div className="flex flex-wrap justify-start gap-2.5">
                {categoriesColors.map((color, idx) => (
                  <Button
                    key={idx}
                    onClick={() => {
                      setNewCategoryColor(color);
                      setIsSelectedColor(idx);
                    }}
                    className={`w-7 h-7 rounded-full hover:scale-110 cursor-pointer duration-200 p-0 ${isSelectedColor === idx && "scale-125 border-2 border-gray-200 dark:border-primary"}`}
                    style={{ backgroundColor: color }}
                  ></Button>
                ))}
              </div>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="categoryResult">Your New Category</Label>
              <Input
                value={newCategoryIcon + "  " + newCategoryName}
                readOnly
                id="categoryResult"
                type="text"
                placeholder="Your Category!"
                className="placeholder:text-sm text-sm text-black dark:text-white border-gray-300 dark:border-card ring-0!"
                style={{ backgroundColor: newCategoryColor }}
              />
            </div>
          </div>
        </form>
        <DialogFooter className="bg-transparent border-none">
          <DialogClose
            asChild
            onClick={() => dispatch(isAddCategoryDialogOpen(false))}
          >
            <Button
              onClick={() => {
                setNewCategoryName("");
                setNewCategoryColor("");
                setNewCategoryIcon("");
              }}
              variant="outline"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            className="bg-blue-500 px-8 rounded-md hover:bg-blue-600 duration-200"
            disabled={!newCategoryName || !newCategoryIcon || !newCategoryColor}
            type="button"
            onClick={handleAddCategory}
          >
            {isLoading ? (
              <>
                <Spinner className="h-4 w-4" />
                <span>Creating...</span>
              </>
            ) : (
              "Add Category"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
