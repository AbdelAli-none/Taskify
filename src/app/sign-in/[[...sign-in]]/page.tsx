import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="h-full w-full flex items-center justify-center p-1 rounded-xl mt-1 shadow-2xl dark:shadow-[0_0_10px_rgba(255,255,255,0.4)] bg-card duration-200 bg-[url('/dashboard-light.png')] dark:bg-[url('/dashboard-dark.png')] bg-cover">
      <SignIn />
    </div>
  );
}
