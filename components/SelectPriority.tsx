import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
// import { capitalize } from "@/utils/capital";
// import { useDispatch } from "react-redux";
import { IPriority, ITodo } from "@/interfaces";
import { Spinner } from "./ui/spinner";
import { Dispatch, SetStateAction } from "react";

interface SelectPriorityProps {
  loading: boolean;
  priorities: IPriority[];
  onSelect?: (id: number) => void;
  selectedPriority?: IPriority;
  setUpdateToDo?: Dispatch<SetStateAction<ITodo>>;
}

export const SelectPriority = ({
  loading,
  priorities,
  onSelect,
  selectedPriority,
  setUpdateToDo,
}: SelectPriorityProps) => {
  const { id } = selectedPriority || {};

  const SP = "\u00A0".repeat(5);

  if (loading) {
    return (
      <div className="flex w-full items-center gap-1.5 rounded-lg border border-input bg-transparent py-1.5 pr-2 pl-2.5 text-sm whitespace-nowrap transition-colors outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-placeholder:text-muted-foreground data-[size=default]:h-8 data-[size=sm]:h-7 data-[size=sm]:rounded-[min(var(--radius-md),10px)] *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
        {" "}
        <Spinner />
        <p>Loading priorities List...</p>
      </div>
    );
  }

  return (
    <Select
      value={id ? String(id) : undefined}
      onValueChange={(value) => {
        const id = Number(value);
        if (onSelect) onSelect(id);
        const selected = priorities?.find((p) => p.id === id);
        if (selected && setUpdateToDo) {
          setUpdateToDo((prev) => ({
            ...prev,
            priority: {
              ...prev.priority,
              id: selected.id,
              bgColor: selected.bgColor,
              icon: selected.icon,
              level: selected.level,
              value: selected.value,
            },
          }));
        }
      }}
    >
      <SelectTrigger className="w-full ps-0!">
        <SelectValue placeholder={`${SP}Give your task a priority boost 🚀`} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Levels</SelectLabel>
          {priorities.map((priorityItem, idx) => {
            const { icon, level, bgColor, id } = priorityItem;
            return (
              <SelectItem key={idx} value={`${id}`}>
                <span
                  className="text-[18px] p-1 rounded-tr-xl rounded-br-xl"
                  style={{ backgroundColor: String(bgColor) }}
                >
                  {icon}
                </span>
                <span>{level}</span>
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
