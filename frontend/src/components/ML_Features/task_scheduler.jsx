import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { fetchTasks } from "@/utils/get_tasks";
import { isSameDay, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";

export default function TaskScheduler() {
  const [tasks, setTasks] = useState([]);
  const [value, setValue] = useState(new Date());
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const loadTasks = async () => {
      const data = await fetchTasks(token);
      setTasks(data);
    };
    loadTasks();
  }, [token]);

  const getTaskColor = (task) => {
    if (task.completed_date) return "bg-blue-500 text-white";
    if (task.risk_prediction === "High Risk") return "bg-red-500 text-white";
    if (task.risk_prediction === "Low Risk") return "bg-green-500 text-white";
    return "bg-gray-300";
  };

  const tileContent = ({ date }) => {
    const dayTasks = tasks.filter((task) =>
      isSameDay(parseISO(task.deadline), date)
    );

    if (dayTasks.length > 0) {
      return (
        <div className="flex flex-col mt-1 space-y-1">
          {dayTasks.map((task) => (
            <Badge
              key={task.id}
              className={`${getTaskColor(task)} text-xs w-full text-center rounded-md`}
            >
              {task.task_type}
            </Badge>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      <Calendar
        onChange={setValue}
        value={value}
        tileContent={tileContent}
        view="month"
        className="w-full border-0 shadow-none bg-transparent text-sm"
      />

      {/* Custom CSS overrides for bigger cells */}
      <style >{`
        .react-calendar {
          width: 100% !important;
          max-width: none !important;
          border: none !important;
          background: transparent !important;
          font-family: inherit;
          font-size: 1rem;
        }
        .react-calendar__month-view__days__day {
          min-height: 100px !important; /* Taller cells */
        }
        .react-calendar__tile {
          padding: 10px 6px !important;
        }
        .react-calendar__month-view__weekdays {
          font-weight: bold;
          font-size: 1rem;
        }
        .react-calendar__tile--now {
          background: rgba(59, 130, 246, 0.15) !important;
          border-radius: 8px;
        }
        .react-calendar__tile--active {
          background: rgba(59, 130, 246, 0.4) !important;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
}
