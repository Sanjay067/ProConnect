import UserLayout from "@/layout/UserLayout";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  return (
    <UserLayout>
      <div className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-8 rounded-2xl bg-white p-6 shadow-sm md:flex-row md:gap-10 md:p-10">
          <div className="flex w-full justify-center md:w-1/2 md:justify-end">
            <img
              src="/login-hero.svg"
              alt="login-hero.svg"
              className="h-56 w-auto max-w-full sm:h-72 md:h-[28rem]"
            />
          </div>
          <div className="flex w-full flex-col items-start justify-center gap-4 text-left md:w-1/2">
            <div className="space-y-4">
            <p className="text-3xl font-semibold leading-tight sm:text-4xl">
              Connect with the world.
              <br />
              Join the Conversation with Professionals
            </p>
            <p className="text-base font-light text-gray-700 sm:text-xl">
              A true Social Network for Professionals. Build your professional
              brand, network with industry leaders, and discover exciting career
              opportunities.
            </p>
            <button
              className="mt-2 rounded-xl bg-fuchsia-600 px-6 py-3 text-lg font-semibold text-white transition hover:bg-fuchsia-700 sm:px-8"
              onClick={() => {
                router.push("/home");
              }}
            >
              Join Now
            </button>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
