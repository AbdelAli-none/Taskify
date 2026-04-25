"use client";

import Image from "next/image";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Layers2, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export const description = "A radial chart with stacked sections";

const chartConfig = {
  pending: {
    label: "Pending",
    color: "var(--chart-1)",
  },
  completed: {
    label: "Completed",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

interface TodosStatsProps {
  completedToDosLength: number;
  pendingToDosLength: number;
}

export function TodosStats({
  completedToDosLength,
  pendingToDosLength,
}: TodosStatsProps) {

  const totalToDos = pendingToDosLength + completedToDosLength;
  const chartData = [
    {
      completed: completedToDosLength,
      pending: pendingToDosLength,
    },
  ];

  return (
    <Card className="text-start h-full flex flex-col justify-center p-2 gap-0 bg-linear-to-bl from-green-400/75 via-green-400/75 to-green-300/75 shadow shadow-primary">
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
              src={"/emptyTwo.png"}
              alt="noCompletedTodos"
              width={170}
              height={170}
              className="m-auto"
            ></Image>
            <p className="text-gray dark:text-gray-200 mt-6 text-sm">
              You haven’t add any tasks yet. Click{" "}
              <span className="bg-green-500 text-white font-semibold px-2 rounded-md">
                +
              </span>{" "}
              above on navbar to create one and see progress!
            </p>
          </div>
        </motion.div>
      ) : (
        <>
          <CardHeader className="items-center pb-0 px-0 flex text-sky-900 dark:text-blue-900">
            <Layers2 className="w-5 h-5" />
            <CardTitle className="text-md font-light">
              Your Tasks Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-1 items-center pb-0">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square w-full max-w-52.5"
            >
              <RadialBarChart
                data={chartData}
                endAngle={180}
                innerRadius={"75%"}
                outerRadius={"100%"}
              >
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) - 16}
                              className="fill-foreground text-3xl font-bold"
                            >
                              {totalToDos.toLocaleString()}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 4}
                              className="fill-muted-foreground font-semibold"
                            >
                              Tasks
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </PolarRadiusAxis>
                <RadialBar
                  dataKey="completed"
                  fill="var(--color-completed)"
                  stackId="a"
                  cornerRadius={5}
                  className="stroke-transparent stroke-2"
                />
                <RadialBar
                  dataKey="pending"
                  stackId="a"
                  cornerRadius={5}
                  fill="var(--color-pending)"
                  className="stroke-transparent stroke-2"
                />
              </RadialBarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm font-light mt-auto mb-2">
            <div className="flex items-center gap-2 leading-none">
              Completed and pending tasks! 💪
              <TrendingUp className="h-4 w-4" />
            </div>
          </CardFooter>
        </>
      )}
    </Card>
  );
}
