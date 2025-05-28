export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'open' | 'completed';
}

export type TaskFilter = 'all' | 'open' | 'completed';