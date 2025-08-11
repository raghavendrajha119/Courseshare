import { useEffect, useState } from "react";
import { fetchProfileDetails } from "@/utils/get_profile";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarIcon, ClipboardList } from "lucide-react";
import TaskScheduler from "../ML_Features/task_scheduler";
import AddTask from "../ML_Features/AddTask";
import TaskBuckets from "../ML_Features/TaskBuckets";

export default function ProfileDetails() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const BASE_URL = "http://localhost:8000";
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const getProfile = async () => {
      const res = await fetchProfileDetails();
      setProfile(res);
      setLoading(false);
    };
    getProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center mt-10">
        <Card className="w-full max-w-md p-6">
          <Skeleton className="h-20 w-20 rounded-full mx-auto mb-4" />
          <Skeleton className="h-4 w-3/4 mx-auto mb-2" />
          <Skeleton className="h-4 w-1/2 mx-auto mb-4" />
          <Skeleton className="h-3 w-2/3 mx-auto mb-1" />
          <Skeleton className="h-3 w-1/2 mx-auto mb-1" />
          <Skeleton className="h-10 w-32 mx-auto mt-4" />
        </Card>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center text-red-500 mt-10">
        Failed to load profile.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 items-center mt-10 w-full">
      {/* Profile Card */}
      <Card className="w-full max-w-md p-6 shadow-lg rounded-2xl">
        <CardHeader className="flex items-center flex-col space-y-4">
          <Avatar className="h-20 w-20">
            <AvatarImage
              src={
                profile.profile_image
                  ? BASE_URL + profile.profile_image
                  : "https://api.dicebear.com/7.x/initials/svg?seed=" +
                    profile.name
              }
              alt={profile.name}
            />
            <AvatarFallback>{profile.name[0]}</AvatarFallback>
          </Avatar>
          <div className="text-center">
            <CardTitle className="text-2xl">{profile.name}</CardTitle>
            <CardDescription>{profile.email}</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 mt-4">
          <div className="text-sm text-muted-foreground">Bio</div>
          <div className="text-base font-medium">
            {profile.bio || "No bio added."}
          </div>

          <div className="text-sm text-muted-foreground mt-4 flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            <span>DOB: {profile.dob || "Not set"}</span>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center mt-6">
          <Button onClick={() => navigate(`/update-profile`)} variant="outline">
            Update Profile
          </Button>
        </CardFooter>
      </Card>

      {/* Manage Tasks Section */}
      <section className="w-full max-w-[90rem] px-4 md:px-10">
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl p-8 shadow-lg border border-purple-200">
          <h2 className="text-3xl font-bold text-purple-900 mb-8 flex items-center gap-3">
            <ClipboardList className="w-8 h-8 text-purple-600" />
            Manage Tasks
          </h2>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Add Task - Smaller Area */}
            <div className="w-full md:max-w-sm">
              <AddTask
                onTaskAdded={(newTask) =>
                  setTasks((prev) => [...prev, newTask])
                }
              />
            </div>

            {/* Calendar - Larger Area */}
            <div className="flex-1">
              <Card className="p-6 shadow-md rounded-xl border border-purple-300 bg-white w-full">
                <TaskScheduler tasks={tasks}/>
                <TaskBuckets onTasksUpdated={setTasks}/>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
