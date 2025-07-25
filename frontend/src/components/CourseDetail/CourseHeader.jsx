import { Badge } from "@/components/ui/badge";

export default function CourseHeader({ title, category }) {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
      <Badge variant="secondary" className="w-fit">{category}</Badge>
    </div>
  );
}
