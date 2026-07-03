import { HomeCta } from "../common/components/HomeCta";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-col items-center gap-8 px-16 py-32 text-center">
        <h1 className="text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
          Sasuco LMS
        </h1>
        <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          Quản lý khóa học, giảng dạy và đăng ký học tập trung — dành cho quản
          trị viên, quản lý, giảng viên và học viên.
        </p>
        <HomeCta />
      </main>
    </div>
  );
}
