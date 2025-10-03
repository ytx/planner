import {
  createContext,
  useReducer,
  useEffect,
  useContext,
} from 'react';
import type { ReactNode, Dispatch } from 'react';
import type { AppData, Task, Category } from '../types/index.ts';

// --- Reducer Actions Definition ---
type Action =
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'ADD_TASK'; payload: { task: Task; list: 'today' | 'tomorrow' } }
  | { type: 'UPDATE_TASK'; payload: { updatedTask: Task; list: 'today' | 'tomorrow' } }
  | { type: 'DELETE_TASK'; payload: { taskId: string; list: 'today' | 'tomorrow' } }
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'UPDATE_CATEGORY'; payload: Category }
  | { type: 'DELETE_CATEGORY'; payload: { id: string } }
  | { type: 'OPEN_SETTINGS_MODAL' }
  | { type: 'CLOSE_SETTINGS_MODAL' }
  | { type: 'ADVANCE_DATE' }
  | { type: 'IMPORT_DATA'; payload: AppData }
  | { type: 'MOVE_TASK_TO_TODAY'; payload: { taskId: string } }
  | { type: 'MOVE_TASK_TO_TOMORROW'; payload: { taskId: string } }
  | { type: 'OPEN_WORK_TIME_ADJUSTMENT'; payload: { taskId: string; initialWorkTime: number; listType: 'today' | 'tomorrow' } }
  | { type: 'CLOSE_WORK_TIME_ADJUSTMENT' }
  | { type: 'SET_CATEGORY_FILTER'; payload: string | null };

// --- App Reducer ---
const appReducer = (state: AppData, action: Action): AppData => {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, settings: { ...state.settings, theme: action.payload } };
    case 'ADD_TASK':
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [action.payload.list]: [
            ...state.tasks[action.payload.list],
            { ...action.payload.task, status: 'todo', startTime: undefined, endTime: undefined, workTime: undefined },
          ],
        },
      };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [action.payload.list]: state.tasks[action.payload.list].map((task) =>
            task.id === action.payload.updatedTask.id
              ? action.payload.updatedTask
              : task,
          ),
        },
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [action.payload.list]: state.tasks[action.payload.list].filter(
            (task) => task.id !== action.payload.taskId,
          ),
        },
      };
    case 'ADD_CATEGORY':
      return {
        ...state,
        settings: {
          ...state.settings,
          categories: [...state.settings.categories, { ...action.payload, color: action.payload.color || '#CCCCCC' }], // デフォルト色を設定
        },
      };
    case 'UPDATE_CATEGORY':
      return {
        ...state,
        settings: {
          ...state.settings,
          categories: state.settings.categories.map((cat) =>
            cat.id === action.payload.id ? { ...action.payload, color: action.payload.color || '#CCCCCC' } : cat,
          ),
        },
      };
    case 'DELETE_CATEGORY': {
      // Also remove the categoryId from all tasks that use it
      const newTasksToday = state.tasks.today.map((task) =>
        task.categoryId === action.payload.id
          ? { ...task, categoryId: undefined }
          : task,
      );
      const newTasksTomorrow = state.tasks.tomorrow.map((task) =>
        task.categoryId === action.payload.id
          ? { ...task, categoryId: undefined }
          : task,
      );
      return {
        ...state,
        settings: {
          ...state.settings,
          categories: state.settings.categories.filter(
            (cat) => cat.id !== action.payload.id,
          ),
        },
        tasks: {
          today: newTasksToday,
          tomorrow: newTasksTomorrow,
        },
      };
    }
    case 'ADVANCE_DATE': {
      const today = state.settings.currentDate;
      const completedToday = state.tasks.today.filter((t) => t.status === 'done');
      const incompleteToday = state.tasks.today.filter((t) => t.status !== 'done');

      const newTodayTasks = [...incompleteToday]; // 明日以降のタスクは自動で移動しない
      const newTomorrowTasks = [...state.tasks.tomorrow]; // 明日以降のタスクはそのまま残す

      const nextDate = new Date(today);
      nextDate.setDate(nextDate.getDate() + 1);
      const nextDateString = nextDate.toISOString().slice(0, 10);

      return {
        ...state,
        settings: {
          ...state.settings,
          currentDate: nextDateString,
        },
        tasks: {
          today: newTodayTasks,
          tomorrow: newTomorrowTasks,
        },
        history: {
          ...state.history,
          [today]: [...(state.history[today] || []), ...completedToday],
        },
      };
    }
    case 'IMPORT_DATA':
      return action.payload;
    case 'OPEN_SETTINGS_MODAL':
      return { ...state, settings: { ...state.settings, isSettingsModalOpen: true } };
    case 'CLOSE_SETTINGS_MODAL':
      return { ...state, settings: { ...state.settings, isSettingsModalOpen: false } };
    case 'OPEN_WORK_TIME_ADJUSTMENT':
      return { ...state, settings: { ...state.settings, workTimeAdjustingTaskId: action.payload.taskId, workTimeAdjustingListType: action.payload.listType } };
    case 'CLOSE_WORK_TIME_ADJUSTMENT':
      return { ...state, settings: { ...state.settings, workTimeAdjustingTaskId: null, workTimeAdjustingListType: null } };
    case 'SET_CATEGORY_FILTER':
      return { ...state, settings: { ...state.settings, activeCategoryFilter: action.payload } };
    default:
      return state as AppData;
  }
};

const getTodayString = () => new Date().toISOString().slice(0, 10);

// --- Initial State ---
const getInitialState = (): AppData => {
  const savedData = localStorage.getItem('plannerData');
  if (savedData) {
    try {
      // Basic validation to ensure the loaded data has the core structure.
      const parsed = JSON.parse(savedData);
      if (parsed.settings && parsed.tasks && parsed.history) {
        return parsed;
      }
    } catch (e) {
      console.error('Error parsing localStorage data, resetting to default:', e);
    }
  }
  // Return a default structure if no valid data is found.
  return {
    settings: {
      theme: 'light',
      isSettingsModalOpen: false,
      workTimeAdjustingTaskId: null,
      workTimeAdjustingListType: null,
      activeCategoryFilter: null, // Initialize activeCategoryFilter
      currentDate: getTodayString(),
      categories: [],
    },
    tasks: {
      today: [],
      tomorrow: [],
    },
    history: {},
  };
};

// --- Context Definition ---
interface AppContextType {
  state: AppData;
  dispatch: Dispatch<Action>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// --- Provider Component ---
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, getInitialState());

  useEffect(() => {
    localStorage.setItem('plannerData', JSON.stringify(state));
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// --- Custom Hook for easy context access ---
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};