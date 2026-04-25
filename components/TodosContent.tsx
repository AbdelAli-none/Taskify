"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ScrollArea } from "./ui/scroll-area";
import { ITodo } from "@/interfaces";
import { CardToDo } from "./CardTodo";
import { ImageSection } from "./ImageSection";


interface TodosContentProps {
  todos: ITodo[];
}

const TodosContent = ({ todos }: TodosContentProps) => {
  const pendingTodos = todos.filter((todo) => !todo.isDone);
  const completedTodos = todos.filter((todo) => todo.isDone);

  return (
    <div className="h-full">
      <motion.div
        layout
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 0 }}
        transition={{ duration: 0.3, delay: 1 }}
        className="grid grid-cols-1 md:grid-cols-[2fr_2fr] gap-3 overflow-hidden p-2 h-full"
      >
        <div className="flex flex-col p-2 overflow-auto border-gray-200 dark:border-gray-800 shadow-sm dark:shadow-gray-900/50 rounded-2xl h-full">
          <ScrollArea className="h-full w-full rounded-md">
            <div
              className={`flex justify-center flex-wrap gap-1 mt-2 px-1 pe-4 ${!pendingTodos.length && "items-center"}`}
              style={
                pendingTodos.length ? {} : { minHeight: "calc(100vh - 200px)" }
              }
            >
              <AnimatePresence mode="popLayout">
                {pendingTodos.length ? (
                  pendingTodos.map((todo) => (
                    <CardToDo key={todo.id} todoInfo={todo} />
                  ))
                ) : (
                  <ImageSection
                    src="ok.png"
                    alt="allTodosCompleted"
                    paragraph="🌟 You’re all caught up!"
                  />
                )}
              </AnimatePresence>
            </div>
          </ScrollArea>
        </div>
        <div className="flex flex-col p-2 overflow-auto shadow-forebackground border-gray-200 dark:border-gray-800 shadow-sm dark:shadow-gray-900/50 rounded-2xl">
          <ScrollArea className="h-full w-full rounded-md">
            <div
              className={`flex justify-center flex-wrap gap-1 mt-2 px-1 pe-4 ${!completedTodos.length && "items-center"}`}
              style={
                completedTodos.length
                  ? {}
                  : { minHeight: "calc(100vh - 200px)" }
              }
            >
              <AnimatePresence mode="popLayout">
                {completedTodos.length ? (
                  completedTodos.map((todo) => (
                    <CardToDo key={todo.id} todoInfo={todo} />
                  ))
                ) : (
                  <ImageSection
                    src="empty.png"
                    alt="noCompletedTodos"
                    paragraph="You haven’t completed any tasks yet. Mark one as done to see progress!"
                  />
                )}
              </AnimatePresence>
            </div>
          </ScrollArea>
        </div>
      </motion.div>
    </div>
  );
};

export default TodosContent;
