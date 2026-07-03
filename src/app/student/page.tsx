import { StudentCourseBrowser } from "../../common/components/StudentCourseBrowser";

export default function StudentPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">Khóa học</h1>
      <StudentCourseBrowser />
    </div>
  );
}
