import React, { useState } from "react";
import { createCourse } from "@/utils/post_courses";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const AddCourse = () => {
  const [formData, setFormData] = useState({
    Coursename: "",
    Institutename: "",
    Details: "",
    Language: "",
    Coursefee: "",
    Thumbnail: null,
    category: "",
    level: "",
  });

  const [duration, setDuration] = useState({ hours: "", mins: "", sec: "" });

  const [videos, setVideos] = useState([
    { title: "", video_url: "", is_preview: false },
  ]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleDurationChange = (e) => {
    const { name, value } = e.target;
    setDuration((prev) => ({ ...prev, [name]: value }));
  };

  const handleVideoChange = (index, field, value) => {
    const updated = [...videos];
    updated[index][field] = value;
    setVideos(updated);
  };

  const addVideoField = () => {
    setVideos([...videos, { title: "", video_url: "", is_preview: false }]);
  };

  const removeVideoField = (index) => {
    const updated = [...videos];
    updated.splice(index, 1);
    setVideos(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fullDuration = `${duration.hours.padStart(2, "0")}:${duration.mins.padStart(
      2,
      "0"
    )}:${duration.sec.padStart(2, "0")}`;

    const courseData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      courseData.append(key, value);
    });

    courseData.append("Duration", fullDuration);
    courseData.append("videos", JSON.stringify(videos));

    const result = await createCourse(courseData);
    if (result) {
      alert("✅ Course created successfully!");
    } else {
      alert("❌ Failed to create course. Check console.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-xl rounded-2xl mt-6">
      <h2 className="text-2xl font-semibold mb-4">Create New Course</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          "Coursename",
          "Institutename",
          "Language",
          "Coursefee",
        ].map((field) => (
          <div key={field}>
            <Label htmlFor={field}>{field}</Label>
            <Input
              id={field}
              name={field}
              onChange={handleChange}
              value={formData[field]}
              required
            />
          </div>
        ))}

        <div>
          <Label htmlFor="Details">Details</Label>
          <Textarea name="Details" onChange={handleChange} required />
        </div>

        {/* Duration Input */}
        <div>
          <Label>Duration</Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min="0"
              max="23"
              placeholder="HH"
              name="hh"
              value={duration.hours}
              onChange={handleDurationChange}
              className="w-20"
              required
            />
            <span>:</span>
            <Input
              type="number"
              min="0"
              max="59"
              placeholder="MM"
              name="mm"
              value={duration.mins}
              onChange={handleDurationChange}
              className="w-20"
              required
            />
            <span>:</span>
            <Input
              type="number"
              min="0"
              max="59"
              placeholder="SS"
              name="ss"
              value={duration.sec}
              onChange={handleDurationChange}
              className="w-20"
              required
            />
          </div>
        </div>

        <div>
          <Label>Category</Label>
          <Select
            onValueChange={(val) =>
              setFormData((prev) => ({ ...prev, category: val }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Tech">Tech</SelectItem>
              <SelectItem value="Business">Business</SelectItem>
              <SelectItem value="Arts">Arts</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Level</Label>
          <Select
            onValueChange={(val) =>
              setFormData((prev) => ({ ...prev, level: val }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Thumbnail</Label>
          <Input
            type="file"
            name="Thumbnail"
            accept="image/*"
            onChange={handleChange}
            required
          />
        </div>

        {/* Videos */}
        <div>
          <h3 className="text-xl font-bold mt-6 mb-2">Videos</h3>
          {videos.map((video, index) => (
            <div key={index} className="border p-4 mb-2 rounded-xl">
              <div>
                <Label>Title</Label>
                <Input
                  value={video.title}
                  onChange={(e) =>
                    handleVideoChange(index, "title", e.target.value)
                  }
                />
              </div>
              <div>
                <Label>Video URL</Label>
                <Input
                  value={video.video_url}
                  onChange={(e) =>
                    handleVideoChange(index, "video_url", e.target.value)
                  }
                />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Checkbox
                  checked={video.is_preview}
                  onCheckedChange={(val) =>
                    handleVideoChange(index, "is_preview", val)
                  }
                />
                <Label>Is Preview?</Label>
              </div>
              <Button
                variant="destructive"
                className="mt-2"
                type="button"
                onClick={() => removeVideoField(index)}
              >
                Remove
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addVideoField}
            className="mt-2"
          >
            + Add another video
          </Button>
        </div>

        <Button type="submit" className="w-full mt-4">
          Create Course
        </Button>
      </form>
    </div>
  );
};

export default AddCourse;
