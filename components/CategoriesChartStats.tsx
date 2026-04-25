"use client";

import Image from "next/image";
import { Layers, TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";
import {
  CardTitle,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "./ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart";
import { motion } from "framer-motion";
import { ICategory, ITodo } from "@/interfaces";

interface ICategoriesData {
  category: string;
  todosCount: number;
  fill: string;
}

interface CategoriesChartStatsProps {
  todos: ITodo[];
  categories: ICategory[];
}

export const CategoriesChartStats = ({
  todos,
  categories,
}: CategoriesChartStatsProps) => {
  const categoriesData: ICategoriesData[] = categories.map(
    (category: ICategory) => {
      return {
        category: category.name,
        todosCount: todos.filter(
          (toDo: ITodo) => toDo.category.name === category.name,
        ).length,
        fill: category.color,
      };
    },
  );

  const categoriesConfig = Object.fromEntries(
    categories.map((category: ICategory) => [
      category.name,
      {
        label: category.name,
        color: category.color,
      },
    ]),
  );

  const totalToDos = todos.length;

  return (
    <Card className="text-start h-full flex flex-col justify-center p-3 gap-0 bg-linear-to-bl from-sky-400/75 via-sky-400/75 to-sky-300/75 shadow shadow-primary">
      {!totalToDos ? (
        <motion.div
          initial={{ opacity: 0, y: 200 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 200 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="m-auto text-center overflow-hidden p-2 relative h-full flex flex-wrap justify-center items-center"
        >
          <div>
            <Image
              src={"/empty.png"}
              width={170}
              height={170}
              alt="noCompletedTodos"
              className="m-auto"
            />
            <p className="text-gray dark:text-gray-200 text-sm">
              You haven’t add any tasks yet. Click{" "}
              <span className="bg-blue-500 text-white font-semibold px-2 rounded-md">
                +
              </span>{" "}
              above on navbar to create one and see progress!
            </p>
          </div>
        </motion.div>
      ) : (
        <>
          <CardHeader className="items-center pb-0 px-0 flex text-sky-900 dark:text-blue-900">
            <Layers className="w-5 h-5" />
            <CardTitle className="text-md font-light">
              Tasks by Category{" "}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={categoriesConfig}
              className="mx-auto aspect-square max-h-52.5"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={categoriesData}
                  dataKey="todosCount"
                  nameKey="category"
                  innerRadius={60}
                  strokeWidth={5}
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-3xl font-bold"
                            >
                              {totalToDos.toLocaleString()}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-muted-foreground font-semibold"
                            >
                              Tasks
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm font-light mt-auto mb-2">
            <div className="flex items-center gap-2 leading-none font-light">
              You’re getting more done lately! 💪{" "}
              <TrendingUp className="h-4 w-4" />
            </div>
          </CardFooter>
        </>
      )}
    </Card>
  );
};
