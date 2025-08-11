import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { addTask } from "@/utils/add_task";

export default function AddTask({ onTaskAdded }) {
  const [taskType, setTaskType] = useState("");
  const [startDate, setStartDate] = useState();
  const [deadline, setDeadline] = useState();

  const token = localStorage.getItem("access_token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!taskType || !startDate || !deadline) {
      alert("Please fill in all fields");
      return;
    }

    const taskData = {
      task_type: taskType,
      start_date: format(startDate, "yyyy-MM-dd"),
      deadline: format(deadline, "yyyy-MM-dd"),
    };

    const result = await addTask(taskData);

    if (result && result.risk_prediction) {
      alert(`Risk Prediction: ${result.risk_prediction}`);
      onTaskAdded(result); // Update calendar instantly
      setTaskType("");
      setStartDate(null);
      setDeadline(null);
    } else {
      alert("Failed to add task");
    }
  };

  return (
    <div className="p-4 rounded-xl bg-white shadow-md border w-full">
      <h3 className="text-lg font-semibold mb-4">Add New Task</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div>
          <Label>Task Type</Label>
          <Select value={taskType} onValueChange={setTaskType}>
            <SelectTrigger>
              <SelectValue placeholder="Select task type" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="Assignment">Assignment</SelectItem>
              <SelectItem value="Quiz">Quiz</SelectItem>
              <SelectItem value="Project">Project</SelectItem>
              <SelectItem value="Exam Prep">Exam Prep</SelectItem>
              <SelectItem value="Lab Report">Lab Report</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full">
                {startDate ? format(startDate, "PPP") : "Pick a start date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Calendar mode="single" selected={startDate} onSelect={setStartDate} />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label>Deadline</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full">
                {deadline ? format(deadline, "PPP") : "Pick a deadline"}
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Calendar mode="single" selected={deadline} onSelect={setDeadline} />
            </PopoverContent>
          </Popover>
        </div>
        <Button type="submit" className="w-full">Add Task</Button>
      </form>
    </div>
  );
}
