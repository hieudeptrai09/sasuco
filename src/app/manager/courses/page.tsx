import { CourseManager } from "../../../common/components/CourseManager";

export default function ManagerCoursesPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">Khóa học</h1>
      <CourseManager />
    </div>
  );
}
