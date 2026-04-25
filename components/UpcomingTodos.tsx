"use client";

import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { motion } from "framer-motion";
import { Flame, TrendingUp } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { ITodo } from "@/interfaces";

interface UpcomingTodosProps {
  todos: ITodo[];
}

export const UpcomingTodos = ({ todos: upcomingTodos }: UpcomingTodosProps) => {
  if (!upcomingTodos) return;

  return (
    <Card className="h-[calc(100%+8px)] overflow-y-auto text-start flex flex-col p-3 gap-0 bg-linear-to-bl from-yellow-400/90 via-yellow-400/75 to-yellow-300/75 shadow shadow-primary">
      {!upcomingTodos.length ? (
        <motion.div
          initial={{ opacity: 0, y: 200 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 200 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="m-auto text-center overflow-hidden p-2 relative h-full flex flex-wrap justify-center items-center"
        >
          <div>
            <Image
              src={"/noTodos.png"}
              alt="noTodos"
              width={220}
              height={220}
              className="m-auto"
            />
            <p className="text-gray dark:text-gray-200 mt-6 text-sm">
              You haven’t any tasks to complete yet. Click{" "}
              <span className="bg-orange-500 text-white font-semibold px-2 rounded-md">
                +
              </span>{" "}
              above on navbar to create one and see progress!
            </p>
          </div>
        </motion.div>
      ) : (
        <>
          <CardHeader className="items-center pb-0 px-0 flex text-sky-900 dark:text-blue-900">
            <Flame className="w-5 h-5" />
            <CardTitle className="text-md font-light">Upcoming Tasks</CardTitle>
          </CardHeader>
          <ScrollArea className="w-full h-72 z-20">
            <CardContent className="flex flex-col flex-1 space-y-2 pb-0 mt-4 pe-3.5">
              {upcomingTodos.map((todo: ITodo, idx) => {
                const {
                  title,
                  category: { iconCategory },
                  priority: { icon },
                } = todo;
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-2 p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="text-lg shrink-0">{icon}</span>
                      <p className="font-medium text-sky-900 truncate">
                        {title}
                      </p>
                    </div>
                    <span className="text-md shrink-0 animate-bounce">
                      {iconCategory}
                    </span>
                  </div>
                );
              })}
            </CardContent>
          </ScrollArea>
          <CardFooter className="flex-col gap-2 text-sm mt-auto mb-2">
            <div className="flex items-center gap-2 leading-none font-light">
              Upcoming tasks should complete! 💪
              <TrendingUp className="h-4 w-4" />
            </div>
          </CardFooter>
        </>
      )}
    </Card>
  );
};
