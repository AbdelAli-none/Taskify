export const dynamic = "force-dynamic";
import { StreakDays } from "@/components/StreakDays";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getTodos } from "../actions/todo/getTodos";
import { UserSection } from "@/components/UserSection";
import { ArrowLeft, Smile } from "lucide-react";
import { ClockCard } from "@/components/Clock";
import { Achievements } from "@/components/Achievements";
import { LongestDayStreak } from "@/components/LongestDayStreak";
import { UpcomingTodos } from "@/components/UpcomingTodos";
import { CategoriesChartStats } from "@/components/CategoriesChartStats";
import { getCategoriesList } from "../actions/category/categoriesList";
import { TodosStats } from "@/components/TodosStats";


const Dashboard = async () => {
  const result = await getTodos();
  const totalTodos = result.data ?? [];
  const categories = (await getCategoriesList()).data ?? [];
  const completedTodos = result.data?.filter((todo) => todo.isDone) ?? [];
  const upcomingTodos = result.data?.filter((todo) => !todo.isDone) ?? [];

  return (
    <div className="p-2 h-full grid grid-cols-12 md:grid-rows-12 gap-2 rounded-xl bg-[url('/dashboard-light.png')] dark:bg-[url('/dashboard-dark.png')]">
      <div className="row-span-1 md:row-span-4 bg-linear-to-tr from-blue-600/75 via-purple-600/75 to-pink-500/75 shadow shadow-primary col-span-12 md:col-span-6 rounded-2xl">
        <div className="flex justify-between items-start flex-wrap p-3">
          <div className="text-start text-gray-800 mt-1 flex-1/2">
            <h2 className="text-md md:text-2xl font-extralight flex items-center flex-nowrap">
              <span className="text-gray-100 dark:text-gray-400">
                Welcome,{" "}
              </span>
              <UserSection />
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
          <div className="w-fit flex-1/2 items-end">
            <StreakDays todos={completedTodos} />
          </div>
        </div>
      </div>

      <div className="row-span-1 p-3 md:row-span-4 bg-linear-to-bl from-cyan-600/75 via-blue-600/75 to-indigo-600/75 col-span-12 md:col-span-6 rounded-2xl">
        <Achievements todos={completedTodos} />
      </div>

      <div className="col-span-6 md:col-span-4 row-span-2 rounded-2xl">
        <LongestDayStreak todos={completedTodos} />
      </div>

      <div className="col-span-6 md:col-span-4 rounded-2xl row-span-2">
        <ClockCard />
      </div>

      <div className="col-span-12 md:col-span-4 rounded-2xl row-span-1 md:row-span-8">
        <UpcomingTodos todos={upcomingTodos} />
      </div>

      <div className="col-span-12 md:col-span-4 rounded-2xl row-span-1 md:row-span-7">
        <CategoriesChartStats todos={totalTodos} categories={categories} />
      </div>

      <div className="col-span-12 md:col-span-4 rounded-2xl row-span-1 md:row-span-7">
        <TodosStats
          completedToDosLength={completedTodos.length}
          pendingToDosLength={upcomingTodos.length}
        />
      </div>
    </div>
  );
};

export default Dashboard;
