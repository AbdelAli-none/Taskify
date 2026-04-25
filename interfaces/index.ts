export interface ITodo {
  id: number;
  title: string;
  description: string;
  isDone: boolean;
  completedAt?: Date | null;
  category: ICategory;
  priority: IPriority;
}

export interface ICategory {
  id: number;
  name: string;
  iconCategory: string;
  color: string;
  createdAt: Date;
  updatedAt: Date | null;
  userId: string;
}

export interface IPriority {
  id: number;
  level: string;
  value: number;
  icon: string;
  bgColor: string | null;
}
