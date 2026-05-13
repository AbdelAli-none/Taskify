"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ScrollArea } from "./ui/scroll-area";
import { ITodo } from "@/interfaces";
import CardToDo from "./CardTodo";
import ImageSection from "./ImageSection";
import { memo, useMemo, useState } from "react";

interface TodosContentProps {
  todos: ITodo[];
}

const TodosContent = ({ todos }: TodosContentProps) => {
  const [activeTab, setActiveTab] = useState<"pending" | "completed">(
    "pending",
  );
  const [direction, setDirection] = useState<1 | -1>(1);

  const handleTabChange = (tab: "pending" | "completed") => {
    setDirection(tab === "completed" ? 1 : -1);
    setActiveTab(tab);
  };

  const pendingTodos = useMemo(
    () => todos.filter((todo) => !todo.isDone),
    [todos],
  );
  const completedTodos = useMemo(
    () => todos.filter((todo) => todo.isDone),
    [todos],
  );

  return (
    <div className="h-full flex flex-col">
      {/* Mobile tab switcher */}
      <div className="flex z-50 md:hidden gap-2 p-2 mx-2 mt-2">
        <button
          onClick={() => handleTabChange("pending")}
          className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors duration-200 ${
            activeTab === "pending"
              ? "bg-blue-500 text-white"
              : "bg-muted text-muted-foreground"
          }`}
        >
          Pending ({pendingTodos.length})
        </button>
        <button
          onClick={() => handleTabChange("completed")}
          className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors duration-200 ${
            activeTab === "completed"
              ? "bg-green-500 text-white"
              : "bg-muted text-muted-foreground"
          }`}
        >
          Completed ({completedTodos.length})
        </button>
      </div>

      <motion.div
        layout
        initial={{ opacity: 0, x: direction * 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: direction * 100 }}
        transition={{ duration: 0.3, delay: 1 }}
        className="grid grid-cols-1 md:grid-cols-[2fr_2fr] gap-0 overflow-y-hidden p-2 flex-1"
      >
        {/* Mobile: animated section swap */}
        <div className="md:hidden overflow-hidden flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: direction * 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * 100 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col p-2 shadow-sm dark:shadow-gray-900/50 rounded-2xl h-full"
            >
              <ScrollArea className="h-full w-full rounded-md p-2 py-1 ring-1 ring-foreground/10">
                <div
                  className={`flex justify-center flex-wrap gap-1 mt-2 p-1 ${
                    (activeTab === "pending" ? pendingTodos : completedTodos)
                      .length === 0 && "items-center"
                  }`}
                  style={
                    (activeTab === "pending" ? pendingTodos : completedTodos)
                      .length
                      ? {}
                      : { minHeight: "calc(100vh - 200px)" }
                  }
                >
                  <AnimatePresence mode="popLayout">
                    {activeTab === "pending" ? (
                      pendingTodos.length ? (
                        pendingTodos.map((todo) => (
                          <CardToDo key={todo.id} todoInfo={todo} />
                        ))
                      ) : (
                        <ImageSection
                          src="ok.png"
                          alt="allTodosCompleted"
                          paragraph="🌟 You're all caught up!"
                        />
                      )
                    ) : completedTodos.length ? (
                      completedTodos.map((todo) => (
                        <CardToDo key={todo.id} todoInfo={todo} />
                      ))
                    ) : (
                      <ImageSection
                        src="empty.png"
                        alt="noCompletedTodos"
                        paragraph="You haven't completed any tasks yet."
                      />
                    )}
                  </AnimatePresence>
                </div>
              </ScrollArea>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Desktop: both sections visible */}
        <div className="hidden md:flex flex-col p-2 overflow-auto shadow-sm dark:shadow-gray-900/50 rounded-2xl h-full">
          <ScrollArea className="h-full w-full rounded-md p-2 py-1 ring-1 ring-foreground/10 dark:border-gray-800">
            <div
              className={`flex justify-center flex-wrap gap-1 mt-2 p-1 ${!pendingTodos.length && "items-center"}`}
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
                    paragraph="🌟 You're all caught up!"
                  />
                )}
              </AnimatePresence>
            </div>
          </ScrollArea>
        </div>

        <div className="hidden md:flex flex-col p-2 overflow-auto border-gray-200 dark:border-gray-800 shadow-sm dark:shadow-gray-900/50 rounded-2xl">
          <ScrollArea className="h-full w-full rounded-md p-2 py-1 ring-1 ring-foreground/10 dark:border-gray-800">
            <div
              className={`flex justify-center flex-wrap gap-1 mt-2 p-1 ${!completedTodos.length && "items-center"}`}
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
                    paragraph="You haven't completed any tasks yet. Mark one as done to see progress!"
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

export default memo(TodosContent);
