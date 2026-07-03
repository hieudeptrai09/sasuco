import Link from "next/link";
import { Card } from "../../common/components/ui/Card";

export default function ManagerOverviewPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
        Tổng quan quản lý
      </h1>
      <Link href="/manager/courses">
        <Card className="max-w-sm transition-colors hover:bg-black/[.02] dark:hover:bg-white/[.04]">
          <h2 className="font-medium text-zinc-950 dark:text-zinc-50">Quản lý khóa học</h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Tạo khóa học, phân công giảng viên và theo dõi số lượng đăng ký.
          </p>
        </Card>
      </Link>
    </div>
  );
}
