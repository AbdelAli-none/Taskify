import { Avatar } from "@radix-ui/react-avatar";
import { Card, CardContent, CardTitle } from "./ui/card";
import { calcConsequitiveDays } from "@/lib/features/dashboard/calcConsequitiveDays";
import { ITodo } from "@/interfaces";

const achievements = [
  {
    name: "Novice",
    icon: "🎯",
    requirement: 1,
    color: "text-amber-300 dark:text-amber-400",
  },
  {
    name: "Consistent",
    icon: "🔥",
    requirement: 7,
    color: "text-amber-300 dark:text-amber-400",
  },
  {
    name: "Dedicated",
    icon: "🚀",
    requirement: 14,
    color: "text-amber-300 dark:text-amber-400",
  },
  {
    name: "Elite",
    icon: "⚡",
    requirement: 30,
    color: "text-amber-300 dark:text-amber-400",
  },
  {
    name: "Legend",
    icon: "👑",
    requirement: 100,
    color: "text-amber-300 dark:text-amber-400",
  },
];

interface AchievementsProps {
  todos: ITodo[];
}

export const Achievements = ({ todos: completedTodos }: AchievementsProps) => {
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

  if (!completedTodos || !dates) return;

  const { longest } = calcConsequitiveDays(dates() ?? []);

  return (
    <div className="w-full">
      <h1 className="text-md md:text-xl text-yellow-400/90 font-normal mb-6">
        🏆 Achievements
      </h1>
      <div className="grid grid-cols-5 gap-x-3">
        {achievements.map((achievement, idx) => (
          <Card
            key={idx}
            className={`p-3 block h-fit bg-transparent hover:bg-black/10 hover:scale-105 duration-500 border-gray/50 dark:border dark:border-gray/30 shadow-md text-center ${
              achievement.requirement <= longest ? "grayscale-0" : "grayscale"
            }`}
          >
            <CardTitle className="font-thin text-sm text-gray-100 mb-1">
              {achievement.name}
            </CardTitle>
            <CardContent className="flex-1 p-0">
              <Avatar className="text-3xl">{achievement.icon}</Avatar>
              <p className={`font-bold ${achievement.color} mt-2`}>
                {achievement.requirement}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
