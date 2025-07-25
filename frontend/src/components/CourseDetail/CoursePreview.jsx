import { AspectRatio } from "@/components/ui/aspect-ratio";

export default function CoursePreview({ thumbnail }) {
  return (
    <AspectRatio ratio={16 / 9}>
      <img
        src={thumbnail}
        alt="Course Thumbnail"
        className="rounded-md object-cover w-full h-full"
      />
    </AspectRatio>
  );
}
