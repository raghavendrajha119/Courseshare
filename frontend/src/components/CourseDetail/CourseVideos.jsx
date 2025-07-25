import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Play } from "lucide-react";

export default function CourseVideos({ videos = [], status }) {
  const [playingVideo, setPlayingVideo] = useState(null);

  const canPlay = (video) => video.is_preview || status === "enrolled";

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">Course Videos</h2>

      {videos.length === 0 ? (
        <p className="text-muted-foreground">No videos available for this course.</p>
      ) : (
        videos.map((video) => (
          <Card key={video.id} className="flex items-center justify-between p-4">
            <div>
              <CardTitle className="text-lg">{video.title}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {video.is_preview ? "Preview Available" : status === "enrolled" ? "Accessible" : "Locked"}
              </p>
            </div>

            {canPlay(video) ? (
              <Button onClick={() => setPlayingVideo(video)} variant="secondary">
                <Play className="h-4 w-4 mr-2" />
                Play
              </Button>
            ) : (
              <Button disabled variant="outline">
                Locked
              </Button>
            )}
          </Card>
        ))
      )}

      {playingVideo && (
        <div className="fixed bottom-10 right-10 z-50 bg-white shadow-xl border border-gray-300 rounded-xl w-[400px] h-[250px]">
          <div className="flex items-center justify-between px-4 py-2 border-b">
            <p className="font-medium text-sm truncate">{playingVideo.title}</p>
            <Button variant="ghost" size="icon" onClick={() => setPlayingVideo(null)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="w-full h-full">
            <iframe
              src={playingVideo.video_url.replace("watch?v=", "embed/")}
              title={playingVideo.title}
              className="w-full h-[200px] rounded-b-xl"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
}
