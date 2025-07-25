import React, { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useParams, useNavigate } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";

export default function UpdateCourse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  const [formData, setFormData] = useState({
    Coursename: "",
    Institutename: "",
    Details: "",
    Language: "",
    Coursefee: "",
    category: "",
    level: "",
    Thumbnail: null,
    hours: "00",
    mins: "00",
    sec: "00",
  });

  const [videoInputs, setVideoInputs] = useState([
    { title: "", video_url: "", is_preview: false },
  ]);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/courseshare/courses/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const {
          Coursename,
          Institutename,
          Details,
          category,
          level,
          Language,
          Coursefee,
          Duration,
          videos,
        } = res.data;

        const [hours = "00", mins = "00", sec = "00"] = (Duration || "00:00:00").split(":");
        setFormData({
          Coursename,
          Institutename,
          Details,
          category,
          level,
          Language,
          Coursefee,
          hours,
          mins,
          sec,
          Thumbnail: null,
        });

        setVideoInputs(videos);
      })
      .catch((err) => console.error("Failed to load course data", err));
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleVideoChange = (index, field, value) => {
    const updated = [...videoInputs];
    updated[index][field] = field === "is_preview" ? value.target.checked : value.target.value;
    setVideoInputs(updated);
  };

  const addVideoInput = () => {
    setVideoInputs([...videoInputs, { title: "", video_url: "", is_preview: false }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const duration = `${String(formData.hours)}:${String(formData.mins)}:${String(formData.sec)}`;

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
        if (!["hours", "mins", "sec"].includes(key) && value !== null) {
          data.append(key, value);
        }
    });

    data.append("Duration", duration);
    data.append("videos", JSON.stringify(videoInputs));
    console.log(data);
    for (let pair of data.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
    }      
    try {
      await axios.put(`http://localhost:8000/courseshare/courses/${id}/`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      alert("✅ Course updated successfully!");
      navigate(`/courses/${id}`);
    } catch (err) {
      console.error("❌ Error updating course", err);
      alert("❌ Failed to update course.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-xl rounded-2xl mt-6">
      <h2 className="text-2xl font-semibold mb-4">Update Course</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {["Coursename", "Institutename", "Language", "Coursefee"].map((field) => (
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
          <Textarea name="Details" value={formData.Details} onChange={handleChange} required />
        </div>

        {/* Duration */}
        <div>
          <Label>Duration</Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min="0"
              max="23"
              placeholder="HH"
              name="hours"
              value={formData.hours || "00"}              onChange={handleChange}
              className="w-20"
              required
            />
            <span>:</span>
            <Input
              type="number"
              min="0"
              max="59"
              placeholder="MM"
              name="mins"
              value={formData.mins || "00"}
              onChange={handleChange}
              className="w-20"
              required
            />
            <span>:</span>
            <Input
              type="number"
              min="0"
              max="59"
              placeholder="SS"
              name="sec"
              value={formData.sec || "00"}
              onChange={handleChange}
              className="w-20"
              required
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <Label>Category</Label>
          <Select value={formData.category} onValueChange={(val) => setFormData((prev) => ({ ...prev, category: val }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="Tech">Tech</SelectItem>
              <SelectItem value="Business">Business</SelectItem>
              <SelectItem value="Arts">Arts</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Level */}
        <div>
          <Label>Level</Label>
          <Select value={formData.level} onValueChange={(val) => setFormData((prev) => ({ ...prev, level: val }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select Level" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Thumbnail */}
        <div>
          <Label>Thumbnail</Label>
          <Input type="file" name="Thumbnail" accept="image/*" onChange={handleChange} />
        </div>

        {/* Videos */}
        <div>
          <h3 className="text-xl font-bold mt-6 mb-2">Videos</h3>
          {videoInputs.map((video, index) => (
            <div key={index} className="border p-4 mb-2 rounded-xl">
              <div>
                <Label>Title</Label>
                <Input
                  value={video.title}
                  onChange={(e) => handleVideoChange(index, "title", e)}
                />
              </div>
              <div>
                <Label>Video URL</Label>
                <Input
                  value={video.video_url}
                  onChange={(e) => handleVideoChange(index, "video_url", e)}
                />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Checkbox
                  checked={video.is_preview}
                  onCheckedChange={(val) => {
                    const event = { target: { checked: val } };
                    handleVideoChange(index, "is_preview", event);
                  }}
                />
                <Label>Is Preview?</Label>
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addVideoInput}
            className="mt-2"
          >
            + Add another video
          </Button>
        </div>

        <Button type="submit" className="w-full mt-4">
          Update Course
        </Button>
      </form>
    </div>
  );
}
