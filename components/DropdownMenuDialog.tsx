"use client";

import { useEffect, useState } from "react";
import { MoreHorizontalIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
// import type { TodoStrapi } from "@/types";
import { SelectCategory } from "./SelectCategory";
import { SelectPriority } from "./SelectPriority";
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
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { ICategory, IPriority, ITodo } from "@/interfaces";
import { handleTodoStatus } from "@/src/app/actions/todo/handleStatus";
import { getCategoriesList } from "@/src/app/actions/category/categoriesList";
import { getPrioritiesList } from "@/src/app/actions/priority/prioritiesList";
import { updateTodo } from "@/src/app/actions/todo/updateTodo";
import { Spinner } from "./ui/spinner";
import { deleteTodo } from "@/src/app/actions/todo/deleteTodo";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/features/store";

interface DropdownMenuDialogProps {
  todoInfo: ITodo;
}

export const DropdownMenuDialog = ({ todoInfo }: DropdownMenuDialogProps) => {
  // states
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [updatedToDo, setUpdateToDo] = useState<ITodo>(todoInfo);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [priorities, setPriorities] = useState<IPriority[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [updatingLoading, setUpdatingLoading] = useState<boolean>(false);

  const isCategoryEditDialogOpen = useSelector(
    (state: RootState) => state.openCloseSlice.isEditCategoryDialogOpen,
  );

  const {
    title: todoTitle,
    description: todoDescription,
    category: {
      iconCategory: todoIconCategory, // ?
      color: todoColorCategory,
      name: todoNameCategory,
    },
    priority: { level: todoPriorityLevel },
  } = todoInfo;

  const {
    id,
    title,
    description,
    isDone,
    category: { iconCategory, color, name },
    priority: { level },
  } = updatedToDo;

  const hasChanges =
    todoTitle !== title ||
    todoNameCategory !== name ||
    todoPriorityLevel !== level ||
    todoDescription !== description ||
    todoColorCategory !== color;

  const hasValidData =
    !!title &&
    !!iconCategory &&
    !!name &&
    description.length >= 10 &&
    !!color &&
    !!level;

  useEffect(() => {
    async function fetchData() {
      const [categoriesResult, prioritiesResult] = await Promise.all([
        getCategoriesList(),
        getPrioritiesList(),
      ]);

      if (categoriesResult.success && categoriesResult.data) {
        setCategories(categoriesResult.data);
      }

      if (prioritiesResult.success && prioritiesResult.data) {
        setPriorities(prioritiesResult.data);
      }
      setLoading(false);
    }
    fetchData();
  }, [isCategoryEditDialogOpen]);

  return (
    <>
      <div className="ml-auto">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              aria-label="Open menu"
              size="icon-sm"
              className="bg-transparent drop-shadow-sm shadow-gray"
            >
              <MoreHorizontalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="opacity-95">
            <DropdownMenuLabel>To Do Actions</DropdownMenuLabel>
            <DropdownMenuGroup>
              {
                <DropdownMenuItem
                  className="cursor-pointer"
                  onSelect={() => {
                    if (isDone) {
                      toast.warning(
                        "Want to tweak one? Just flip it back to Pending first 😏",
                        {
                          action: {
                            label: "Undo completion",
                            onClick: () => {
                              toast.promise(handleTodoStatus(id, isDone), {
                                loading: "Updating todo status...",
                                success: "Todo status has been updated",
                                error: "Failed to update todo status",
                              });
                            },
                          },
                          duration: 5000,
                        },
                      );
                    } else {
                      setShowEditDialog(true); // open dialog of edit todo
                    }
                  }}
                >
                  Edit
                </DropdownMenuItem>
              }
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => {
                  setShowDeleteDialog(true);
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Dialog For Edit ToDo */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <form>
          <DialogContent className="sm:max-w-106.25">
            <DialogHeader>
              <DialogTitle>Edit Your Todo</DialogTitle>
              <DialogDescription>
                Keep your productivity flowing — update your todo with any new
                details or changes that matter.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="title">Todo Title</Label>
                <Input
                  value={updatedToDo["title"]}
                  onChange={(e) => {
                    const { name, value } = e.target;
                    setUpdateToDo((prev) => ({
                      ...prev,
                      [name]: value,
                    }));
                  }}
                  id="title"
                  name="title"
                  placeholder="What needs to be done?"
                />
              </div>
              <div className="grid gap-3">
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <Textarea
                  value={updatedToDo["description"]}
                  onChange={(e) => {
                    const { name, value } = e.target;
                    setUpdateToDo((prev) => ({
                      ...prev,
                      [name]: value,
                    }));
                  }}
                  id="description"
                  name="description"
                  placeholder="Describe more your todo (please fill this in ✨)"
                  rows={4}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="category">Label</Label>
                <SelectCategory
                  selectedCategory={updatedToDo["category"]}
                  setUpdateToDo={setUpdateToDo}
                  categories={categories}
                  loading={loading}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="priority">Todo Priority</Label>
                <SelectPriority
                  selectedPriority={updatedToDo["priority"]}
                  setUpdateToDo={setUpdateToDo}
                  priorities={priorities}
                  loading={loading}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild onClick={() => setShowEditDialog(false)}>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowEditDialog(false);
                    setUpdateToDo(todoInfo);
                  }}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                className="bg-blue-500 px-8 rounded-md hover:bg-blue-600 duration-200"
                disabled={!hasChanges || !hasValidData || updatingLoading}
                type="button"
                onClick={async () => {
                  setUpdatingLoading(true);
                  try {
                    await updateTodo(updatedToDo);
                    toast.success("Todo has been updated");
                    setUpdatingLoading(false);
                  } catch (error) {
                    toast.error("Failed to update todo");
                  } finally {
                    setUpdatingLoading(false);
                  }
                  setShowEditDialog(false);
                }}
              >
                {updatingLoading ? (
                  <span className="flex items-center gap-1 font-medium text-sm tracking-wide animate-pulse">
                    <Spinner className="w-4 h-4" />
                    Updating...
                  </span>
                ) : (
                  "Update Todo"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>

      {/* Dialog For Delete ToDo */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="gap-0">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="bg-transparent border-none">
            <AlertDialogCancel
              onClick={() => {
                setShowDeleteDialog(false);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-gray-200 text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
              onClick={() => {
                setShowDeleteDialog(false);
                toast.promise(deleteTodo(id), {
                  loading: "deleting todo...",
                  success: "todo has been deleted...",
                  error: "failed to delete todo",
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
