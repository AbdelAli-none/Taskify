"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RootState } from "@/lib/features/store";
import { mainDialogOpen } from "@/lib/features/ui/uiSlice";
import { useDispatch, useSelector } from "react-redux";
import { Textarea } from "./ui/textarea";
import { SelectCategory } from "./SelectCategory";
import { SelectPriority } from "./SelectPriority";
import { ICategory, IPriority } from "@/interfaces";
import { useEffect, useState } from "react";
import { getCategoriesList } from "@/src/app/actions/category/categoriesList";
import { getPrioritiesList } from "@/src/app/actions/priority/prioritiesList";
import { createTodo } from "@/src/app/actions/todo/createTodo";
import { Spinner } from "./ui/spinner";
import { toast } from "sonner";

function DialogAddTodo() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [priorities, setPriorities] = useState<IPriority[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [priorityId, setPriorityId] = useState<number | null>(null);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);

  const minimumLength = 10;
  const [minimum, setMinimum] = useState<number>(minimumLength);

  const isAddCategoryDialogOpen = useSelector(
    (state: RootState) => state.openCloseSlice.isAddCategoryDialogOpen,
  );

  const isDeleteCategoryDialogOpen = useSelector(
    (state: RootState) => state.openCloseSlice.isDeleteCategoryDialogOpen,
  );

  const isEditCategoryDialogOpen = useSelector(
    (state: RootState) => state.openCloseSlice.isEditCategoryDialogOpen,
  );

  useEffect(() => {
    async function fetchData() {
      const [categoriesResult, prioritiesResult] = await Promise.all([
        getCategoriesList(),
        getPrioritiesList(),
      ]);

      if (categoriesResult.success && categoriesResult.data)
        setCategories(categoriesResult.data);

      if (prioritiesResult.success && prioritiesResult.data)
        setPriorities(prioritiesResult.data);

      setLoading(false);
    }
    fetchData();
  }, [
    isAddCategoryDialogOpen,
    isDeleteCategoryDialogOpen,
    isEditCategoryDialogOpen,
  ]);

  const handleSubmit = async () => {
    if (!title || !description || !categoryId || !priorityId) return;

    setSaveLoading(true);

    const result = await createTodo({
      title,
      description,
      categoryId,
      priorityId,
    });

    if (result.success && result.data) {
      dispatch(mainDialogOpen(false));
      setTitle("");
      setDescription("");
      setCategoryId(null);
      setPriorityId(null);
      setSaveLoading(false);
    }
  };

  const dispatch = useDispatch();
  const isOpen = useSelector(
    (state: RootState) => state.openCloseSlice.isMainDialogOpen,
  );

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={(open) => dispatch(mainDialogOpen(open))}
      >
        <DialogContent className="sm:max-w-106.25 pb-2">
          <DialogHeader className="text-center!">
            <DialogTitle>Your Next Todo</DialogTitle>
            <DialogDescription>
              Quickly add a new task to your list. You can edit or mark it as
              done later.
            </DialogDescription>
          </DialogHeader>
          <form
            noValidate
            onSubmit={(e) => e.preventDefault()}
            className="my-4"
          >
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Todo Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What needs to be done?"
                />
              </div>
              <div className="grid">
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <Textarea
                  id="description"
                  name="description"
                  value={description}
                  onChange={(e) => {
                    const { name, value } = e.target;
                    setDescription(value);
                    setMinimum(minimumLength - value.length);
                  }}
                  placeholder="Describe more your todo (please fill this in ✨)"
                  rows={4}
                  minLength={10}
                  className={`mt-2 mb-1 rounded p-2 border focus:border-none duration-700
                      ${
                        minimum <= 0
                          ? "focus-visible:ring-2 focus-visible:ring-green-300"
                          : "focus-visible:ring-2 focus-visible:ring-red-300"
                      }`}
                />
                <p className="text-xs text-muted-foreground">
                  Minimum 10 characters required.
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Label</Label>
                <SelectCategory
                  categories={categories}
                  loading={loading}
                  onSelect={(id) => setCategoryId(id)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="priority">Todo Priority</Label>
                <SelectPriority
                  priorities={priorities}
                  loading={loading}
                  onSelect={(id) => setPriorityId(id)}
                />
              </div>
            </div>
          </form>
          <DialogFooter>
            <DialogClose
              asChild
              onClick={() => dispatch(mainDialogOpen(false))}
            >
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  dispatch(mainDialogOpen(false));
                }}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              className="bg-blue-500 px-8 rounded-md hover:bg-blue-600 duration-200 text-background"
              type="button"
              onClick={() =>
                toast.promise(handleSubmit, {
                  loading: "Creating new todo...",
                  success: "New todo has been created",
                  error: "Failed to create new todo",
                })
              }
              disabled={!title || !(minimum <= 0) || !categoryId || !priorityId}
            >
              {saveLoading ? (
                <span className="flex items-center gap-1 font-medium text-sm tracking-wide animate-pulse">
                  <Spinner className="w-4 h-4" />
                  creating...
                </span>
              ) : (
                "Save Todo"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default DialogAddTodo;
