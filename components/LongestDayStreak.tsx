import { calcConsequitiveDays } from "@/lib/features/dashboard/calcConsequitiveDays";
import { Card, CardContent } from "./ui/card";
import { ITodo } from "@/interfaces";

interface LongestDayStreakProps {
  todos: ITodo[];
}

export const LongestDayStreak = ({
  todos: completedTodos,
}: LongestDayStreakProps) => {
  const dates = () => {
    if (!completedTodos) return;

    return [
      ...new Set(
        completedTodos
          .map((todo: ITodo) => todo.completedAt)
          .filter((date): date is Date => date !== null && date !== undefined)
          .map((date) => date.toISOString().split("T")[0]),
      ),
    ];
  };

  if (!completedTodos || !dates) return;

  const { longest } = calcConsequitiveDays(dates() ?? []);

  return (
    <Card className="justify-center h-full bg-linear-to-br from-amber-400/95 to-orange-500/75 border-none shadow shadow-primary p-0">
      <CardContent className="p-2 md:p-4 flex items-center gap-3">
        <span className="text-3xl">🔥</span>
        <div>
          <p className="text-white/90 text-xs font-medium">Best Streak</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-white">{longest}</span>
            <span className="text-white/80 text-sm">days</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
