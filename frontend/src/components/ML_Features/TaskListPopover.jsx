import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { markTaskComplete } from "@/utils/mark_task_complete";
import { updateTask } from "@/utils/update_task";
import { deleteTask } from "@/utils/delete_task";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

// import { useToast } from "@/components/ui/use-toast";

export default function TaskListPopover({
  tasks,
  onTaskComplete,
  onTaskUpdate,
  onTaskDelete,
  allowActions = false,
}) {
  const [editTask, setEditTask] = useState(null);
  const [formData, setFormData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const { toast } = useToast();

  const getTaskColor = (task) => {
    if (task.completed_date) return "bg-blue-500 text-white";
    if (task.risk_prediction === "High Risk") return "bg-red-500 text-white";
    if (task.risk_prediction === "Low Risk") return "bg-green-500 text-white";
    return "bg-gray-300";
  };

  const handleComplete = async (task) => {
    const updated = await markTaskComplete(task.id);
    if (updated) {
      onTaskComplete(task);
      toast({ title: "Task marked complete ✅" });
    }
  };

  const handleUpdateSubmit = async () => {
    const updated = await updateTask(editTask.id, formData);
    if (updated) {
      setOpenDialog(false);
      toast({ title: "Task updated successfully ✅" });
      if (onTaskUpdate) onTaskUpdate(updated);
    }
  };

  const handleDelete = async (task) => {
    const deleted = await deleteTask(task.id);
    if (deleted) {
      toast({ title: "Task deleted 🗑️" });
      if (onTaskDelete) onTaskDelete(task.id);
    }
  };

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <motion.div
          key={task.id}
          layout
          className="p-3 rounded-lg shadow-sm border bg-white flex justify-between items-center"
        >
          <Badge className={`${getTaskColor(task)}`}>{task.task_type}</Badge>
          {allowActions && (
            <div className="flex gap-3 items-center">
              {/* Update */}
              <Dialog open={openDialog && editTask?.id === task.id} onOpenChange={setOpenDialog}>
                <DialogTrigger asChild>
                  <button
                    onClick={() => {
                      setEditTask(task);
                      setFormData(task);
                      setOpenDialog(true);
                    }}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Update
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Task</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-2">
                    <Label>Task Type</Label>
                    <Input
                      value={formData.task_type || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, task_type: e.target.value })
                      }
                    />
                    <Label>Start Date</Label>
                    <Input
                      type="date"
                      value={formData.start_date?.split("T")[0] || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, start_date: e.target.value })
                      }
                    />
                    <Label>Deadline</Label>
                    <Input
                      type="date"
                      value={formData.deadline?.split("T")[0] || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, deadline: e.target.value })
                      }
                    />
                    <Button onClick={handleUpdateSubmit}>Save</Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Complete */}
              <button
                onClick={() => handleComplete(task)}
                className="text-sm text-green-600 hover:underline"
              >
                Complete
              </button>

              {/* Delete */}
              <button
                onClick={() => handleDelete(task)}
                className="text-sm text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
