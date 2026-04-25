import { getTodos } from "@/src/app/actions/todo/getTodos";
import NoTasksAdded from "./NoTasksAdded";
import TodosContent from "./TodosContent";
import { EditCategoryDialog } from "./EditCategoryDialog";

const MainContent = async () => {
  const result = await getTodos();
  const todos = result.data ?? [];
  return (
    <section className="h-full overflow-y-auto bg-cover rounded-xl duration-200 bg-[url('/dashboard-light.png')] dark:bg-[url('/dashboard-dark.png')]">
      {todos.length === 0 ? <NoTasksAdded /> : <TodosContent todos={todos} />}
    </section>
  );
};

export default MainContent;
