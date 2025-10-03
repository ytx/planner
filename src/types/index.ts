export type Task = {
  id: string;
  title: string;
  link?: string;
  categoryId?: string;
  status: 'todo' | 'in-progress' | 'paused' | 'done';
  listType?: 'today' | 'tomorrow'; // Add listType to Task interface
  startTime?: number; // Unix timestamp for current segment start
  endTime?: number; // Unix timestamp for current segment end
  workTime?: number; // Total accumulated work time in minutes
  createdAt: number; // Unix timestamp
};

export type Category = {
  id: string;
  name: string;
  color: string; // Add color property to Category
};

export type AppData = {
  settings: {
    theme: 'light' | 'dark';
    isSettingsModalOpen: boolean;
    workTimeAdjustingTaskId: string | null;
    workTimeAdjustingListType: 'today' | 'tomorrow' | null;
    activeCategoryFilter: string | null; // Add activeCategoryFilter
    currentDate: string; // YYYY-MM-DD format
    categories: Category[];
  };
  tasks: {
    today: Task[];
    tomorrow: Task[];
  };
  history: {
    [date: string]: Task[]; // e.g., '2025-10-03'
  };
};
