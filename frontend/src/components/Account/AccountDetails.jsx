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
import { Badge } from "@/components/ui/badge";
import { CalendarIcon } from "lucide-react";

export default function ProfileDetails() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const BASE_URL = 'http://localhost:8000'
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
    return <div className="text-center text-red-500 mt-10">Failed to load profile.</div>;
  }

  return (
    <div className="flex justify-center mt-10">
      <Card className="w-full max-w-md p-6 shadow-lg rounded-2xl">
        <CardHeader className="flex items-center flex-col space-y-4">
          <Avatar className="h-20 w-20">
            <AvatarImage
              src={BASE_URL+profile.profile_image || "https://api.dicebear.com/7.x/initials/svg?seed=" + profile.name}
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
          <div className="text-base font-medium">{profile.bio || "No bio added."}</div>

          <div className="text-sm text-muted-foreground mt-4 flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            <span>DOB: {profile.dob || "Not set"}</span>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center mt-6">
          <Button onClick={() => navigate(`/update-profile`)} variant="outline">Update Profile</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
