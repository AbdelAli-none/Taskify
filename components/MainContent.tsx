import { getTodos } from "@/src/app/actions/todo/getTodos";
import NoTasksAdded from "./NoTasksAdded";
import TodosContent from "./TodosContent";
import Image from "next/image";

const MainContent = async () => {
  const result = await getTodos();
  const todos = result.data ?? [];
  return (
    <section className="relative h-full overflow-y-auto rounded-xl duration-200">
      <Image
        src="/dashboard-light.png"
        alt="Dashboard Background"
        fill
        priority // This is the most important prop for LCP!
        className="object-cover -z-10 dark:hidden"
        sizes="(max-width: 768px) 100vw, 80vw"
      />
      <Image
        src="/dashboard-dark.png"
        alt="Dashboard Background"
        fill
        priority
        className="object-cover -z-10 hidden dark:block"
        sizes="(max-width: 768px) 100vw, 80vw"
      />
      {todos.length === 0 ? <NoTasksAdded /> : <TodosContent todos={todos} />}
    </section>
  );
};

export default MainContent;
