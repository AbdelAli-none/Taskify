import { getTodos } from "@/src/app/actions/todo/getTodos";
import NoTasksAdded from "./NoTasksAdded";
import TodosContent from "./TodosContent";
import Image from "next/image";
import { Suspense } from "react";
import { Spinner } from "./ui/spinner";

const MainContent = async () => {
  return (
    <section className="relative h-full flex items-center justify-center overflow-y-auto rounded-xl duration-200">
      <Image
        src="/dashboard-light.png"
        alt="Dashboard Background"
        fill
        priority
        unoptimized
        className="object-cover dark:hidden w-full h-full"
        sizes="(max-width: 768px) 100vw, 80vw"
      />
      <Image
        src="/dashboard-dark.png"
        alt="Dashboard Background"
        fill
        priority
        unoptimized
        className="object-cover hidden dark:block w-full h-full"
        sizes="(max-width: 768px) 100vw, 80vw"
      />
      <Suspense
        fallback={
          <p className="flex items-center space-x-3 z-50">
            {" "}
            <Spinner className="h-3" /> Loading Tasks...
          </p>
        }
      >
        <TodoList />
      </Suspense>
    </section>
  );
};

async function TodoList() {
  const result = await getTodos(); // The "slow" part is now isolated
  const todos = result.data ?? [];
  return todos.length === 0 ? <NoTasksAdded /> : <TodosContent todos={todos} />;
}

export default MainContent;
