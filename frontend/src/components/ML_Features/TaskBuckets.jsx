import { useEffect, useState } from "react";
import { fetchTasks } from "@/utils/get_tasks";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import TaskListPopover from "./TaskListPopover";

export default function TaskBuckets({ onTasksUpdated }) {
  const token = localStorage.getItem("access_token");
  const [incompleteTasks, setIncompleteTasks] = useState([]);
  const [completeTasks, setCompleteTasks] = useState([]);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const allTasks = await fetchTasks(token);
    setIncompleteTasks(allTasks.filter(t => !t.completed_date));
    setCompleteTasks(allTasks.filter(t => t.completed_date));
    if (onTasksUpdated) onTasksUpdated(allTasks);
  };

  const moveToComplete = (task) => {
    setIncompleteTasks(prev => prev.filter(t => t.id !== task.id));
    setCompleteTasks(prev => [...prev, { ...task, completed_date: new Date().toISOString() }]);
  };

  return (
    <div className="flex gap-6 justify-center mt-6">
      {/* Incomplete */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="bg-red-50 border-red-300">
            Incomplete ({incompleteTasks.length})
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
        <TaskListPopover
            tasks={incompleteTasks}
            allowActions={true}
            onTaskComplete={moveToComplete}
            onTaskUpdate={loadTasks}
            onTaskDelete={(id) => {
                setIncompleteTasks((prev) => prev.filter((t) => t.id !== id));
                setCompleteTasks((prev) => prev.filter((t) => t.id !== id));
            }}
        />

        </PopoverContent>
      </Popover>

      {/* Complete */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="bg-blue-50 border-blue-300">
            Complete ({completeTasks.length})
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <TaskListPopover tasks={completeTasks} token={token} allowActions={false} />
        </PopoverContent>
      </Popover>
    </div>
  );
}
