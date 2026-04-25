"use client";

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import { calcConsequitiveDays } from "@/lib/features/dashboard/calcConsequitiveDays";
import { ITodo } from "@/interfaces";

const chartConfig = {
  streakDay: {
    label: "Streak",
    color: "#F1C40F",
  },
} satisfies ChartConfig;

interface StreakDaysProps {
  todos: ITodo[];
}

export const StreakDays = ({ todos: completedTodos }: StreakDaysProps) => {
  const dates = () => {
    if (!completedTodos) return [];
    return [
      ...new Set(
        completedTodos
          .map((todo: ITodo) => todo.completedAt)
          .filter((date): date is Date => date !== null && date !== undefined)
          .map((date) => date.toISOString().split("T")[0]),
      ),
    ];
  };

  const { streakDay, longest } = calcConsequitiveDays(dates() ?? []);

  const achievements = [
    { name: "First Step", icon: "🎯", requirement: 1, unlocked: longest >= 1 },
    { name: "Hot Streak", icon: "🔥", requirement: 7, unlocked: longest >= 7 },
    { name: "On Fire!", icon: "🚀", requirement: 14, unlocked: longest >= 14 },
    {
      name: "Unstoppable",
      icon: "⚡",
      requirement: 30,
      unlocked: longest >= 30,
    },
    { name: "Legend", icon: "👑", requirement: 100, unlocked: longest >= 100 },
  ];

  const nextStage =
    achievements.find((a) => a.requirement > streakDay) ??
    achievements[achievements.length - 1];

  const chartData = [{ streakDay, fill: "#F1C40F" }];

  return (
    <Card className="bg-transparent ring-0 items-end">
      <CardContent className="">
        <ChartContainer className="h-32.5 w-37.5" config={chartConfig}>
          <RadialBarChart
            data={chartData}
            startAngle={0}
            endAngle={streakDay * (360 / Number(nextStage?.requirement))}
            innerRadius={58}
            outerRadius={78}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background duration-200"
              polarRadius={[54, 65]}
            />
            <RadialBar dataKey="streakDay" cornerRadius={10} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
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
                          y={Number(viewBox.cy) - 10}
                          className="fill-foreground text-2xl font-bold font-mono"
                        >
                          {streakDay.toLocaleString()}
                        </tspan>
                        <tspan
                          x={Number(viewBox.cx) + 5}
                          y={(viewBox.cy || 0) + 10}
                          className="fill-muted-foreground text-sm"
                        >
                          Day streak🔥
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
