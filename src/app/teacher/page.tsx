import { TeacherCourseList } from "../../common/components/TeacherCourseList";

export default function TeacherPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
        Khóa học của tôi
      </h1>
      <TeacherCourseList />
    </div>
  );
}
