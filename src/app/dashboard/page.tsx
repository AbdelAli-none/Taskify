export const dynamic = "force-dynamic";

import nextDynamic from "next/dynamic";

import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getTodos } from "../actions/todo/getTodos";
import { getCategoriesList } from "../actions/category/categoriesList";
import { ArrowLeft, Smile } from "lucide-react";

const StreakDays = nextDynamic(() => import("@/components/StreakDays"));
const UserSection = nextDynamic(() =>
  import("@/components/UserSection").then((m) => m.UserSection),
);
const ClockCard = nextDynamic(() => import("@/components/Clock"));
const Achievements = nextDynamic(() => import("@/components/Achievements"));
const LongestDayStreak = nextDynamic(
  () => import("@/components/LongestDayStreak"),
);
const UpcomingTodos = nextDynamic(() => import("@/components/UpcomingTodos"));
const CategoriesChartStats = nextDynamic(
  () => import("@/components/CategoriesChartStats"),
);
const TodosStats = nextDynamic(() => import("@/components/TodosStats"));

const fallback = (label: string) => (
  <p className="text-white/50 text-sm animate-pulse">{label}</p>
);

const Dashboard = async () => {
  const [todosResult, categoriesResult] = await Promise.all([
    getTodos(),
    getCategoriesList(),
  ]);

  const todos = todosResult.data ?? [];
  const completedTodos = todos.filter((todo) => todo.isDone);
  const upcomingTodos = todos.filter((todo) => !todo.isDone);
  const categories = categoriesResult.data ?? [];

  return (
    <div className="p-2 h-full grid grid-cols-12 md:grid-rows-12 gap-2 rounded-xl bg-[url('/dashboard-light.png')] dark:bg-[url('/dashboard-dark.png')]">
      <div className="row-span-1 md:row-span-4 bg-linear-to-tr from-blue-600/75 via-purple-600/75 to-pink-500/75 shadow shadow-primary col-span-12 md:col-span-6 rounded-2xl">
        <div className="flex justify-between items-center flex-nowrap px-2 md:px-3">
          <div className="text-start text-gray-800 mt-1 w-1/2">
            <h2 className="text-md md:text-2xl font-extralight flex items-center flex-nowrap">
              <span className="text-gray-100 dark:text-gray-400">
                Welcome,{" "}
              </span>
              <Suspense fallback={fallback("Loading user...")}>
                <UserSection />
              </Suspense>
              <Smile className="w-6 h-6 text-yellow-400 ml-1 animate-bounce" />
            </h2>
            <p className="text-md md:text-xl text-gray-100 dark:text-gray-400 font-light">
              Track your progress with{" "}
              <span className="font-extrabold">sweet</span> dashboard
            </p>
            <Button
              asChild
              className="mt-5 bg-pink-400 hover:bg-pink-500 duration-300"
            >
              <Link href={"/"}>
                <ArrowLeft /> Back
              </Link>
            </Button>
          </div>
          <div>
            <Suspense fallback={fallback("Loading streak...")}>
              <StreakDays todos={completedTodos} />
            </Suspense>
          </div>
        </div>
      </div>

      <div className="row-span-1 p-3 md:row-span-4 bg-linear-to-bl from-cyan-600/75 via-blue-600/75 to-indigo-600/75 col-span-12 md:col-span-6 rounded-2xl">
        <Suspense fallback={fallback("Loading achievements...")}>
          <Achievements todos={completedTodos} />
        </Suspense>
      </div>

      <div className="col-span-6 md:col-span-4 row-span-2 rounded-2xl">
        <Suspense fallback={fallback("Loading streak stats...")}>
          <LongestDayStreak todos={completedTodos} />
        </Suspense>
      </div>

      <div className="col-span-6 md:col-span-4 rounded-2xl row-span-2">
        <Suspense fallback={fallback("Loading clock...")}>
          <ClockCard />
        </Suspense>
      </div>

      <div className="col-span-12 md:col-span-4 rounded-2xl row-span-1 md:row-span-8">
        <Suspense fallback={fallback("Loading upcoming todos...")}>
          <UpcomingTodos todos={upcomingTodos} />
        </Suspense>
      </div>

      <div className="col-span-12 md:col-span-4 rounded-2xl row-span-1 md:row-span-7">
        <Suspense fallback={fallback("Loading chart...")}>
          <CategoriesChartStats todos={todos} categories={categories} />
        </Suspense>
      </div>

      <div className="col-span-12 md:col-span-4 rounded-2xl row-span-1 md:row-span-7">
        <Suspense fallback={fallback("Loading stats...")}>
          <TodosStats
            completedToDosLength={completedTodos.length}
            pendingToDosLength={upcomingTodos.length}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default Dashboard;
