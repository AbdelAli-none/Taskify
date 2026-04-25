"use client";

import { Circle, CircleCheckBig } from "lucide-react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

import { motion } from "framer-motion";
// import { DropdownMenuDialog } from "./DropDownToDo";
import type { ITodo } from "@/interfaces";
import { toast } from "sonner";
import React from "react";
import { DropdownMenuDialog } from "./DropdownMenuDialog";
import { handleTodoStatus } from "@/src/app/actions/todo/handleStatus";

type CardToDoProps = {
  todoInfo: ITodo;
};

export const CardToDo = ({ todoInfo }: CardToDoProps) => {
  const {
    id,
    title,
    description,
    isDone,
    category: {
      id: categoryId,
      name: categoryTitle,
      color: categoryColor,
      iconCategory,
    },
    priority: { icon: iconPriority, level, bgColor, id: priorityId, value },
  } = todoInfo;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: isDone ? -40 : 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={isDone ? { opacity: 0, x: -40 } : { opacity: 0, x: 40 }}
      transition={{ duration: 0.5 }}
      className={`${
        isDone ? "bg-[#03f4332e]" : "bg-transparent"
      } flex-1/2 justify-start dark:bg-[#1e1e2f91] gap-1 rounded-xl mb-1`}
    >
      <Card className={`text-start bg-transparent px-2 py-2 duration-1000`}>
        <CardHeader className="gap-0 px-3">
          <div className="flex justify-between items-center w-full">
            <CardTitle className="text-sm font-normal flex items-center space-x-2">
              <p>
                {!isDone ? (
                  <Circle
                    className="w-5 hover:text-green-600 duration-300 cursor-pointer"
                    onClick={() => {
                      toast.promise(handleTodoStatus(id, isDone), {
                        loading: "Mark as done...",
                        success: "Todo status has been updated",
                        error: "Failed to update todo status",
                      });
                    }}
                  />
                ) : (
                  <CircleCheckBig
                    onClick={() => {
                      toast.promise(handleTodoStatus(id, isDone), {
                        loading: "Mark as undone...",
                        success: "Todo status has been updated",
                        error: "Failed to update todo status",
                      });
                    }}
                    className="w-5 text-green-600 hover:text-black dark:hover:text-white duration-300 cursor-pointer"
                  />
                )}
              </p>
              <span className="text-md capitalize tracking-wide">{title}</span>
            </CardTitle>

            <DropdownMenuDialog todoInfo={todoInfo} />
          </div>
          <CardDescription className="text-sm mt-2">
            {description}
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-between items-center pt-0 px-3 bg-transparent border-none">
          <div
            style={{ backgroundColor: String(bgColor) }}
            className="p-1 rounded-xl"
          >
            <span className="flex items-center">
              {iconPriority}
              <p className="text-sm lowercase text-gray-500 dark:text-gray-400">
                {level}
              </p>
            </span>
          </div>
          <div className="flex gap-x-1">
            <span
              className={`w-7 h-7 rounded-md flex justify-center items-center`}
              style={{ backgroundColor: categoryColor }}
            >
              {iconCategory}
            </span>
            <span
              className={`text-xs font-semibol text-white px-2.5 py-1.5 rounded-lg`}
              style={{ backgroundColor: categoryColor }}
            >
              {categoryTitle}
            </span>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
