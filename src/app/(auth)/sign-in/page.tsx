/* eslint-disable @next/next/no-img-element */

import { LoginForm } from "@/components/forms/login-form";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="bg-muted relative hidden lg:block">
        <div className="flex flex-col h-full p-10 justify-between">
          <div className="flex z-50 items-center gap-2 font-medium">
            <img src="/kamanga.jpg" alt="Image" width={50} height={50} />
            <span className="font-semibold text-white">
              Barangay Kamanga{" "}
              <span>Health Center</span> Profiling
              System
            </span>
          </div>
          <div className="relative z-20 mt-auto max-w-3xl text-white/70">
            <blockquote className="leading-normal text-balance">
              &ldquo;Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptate a, mollitia quo expedita deserunt at quasi animi. Consectetur, numquam possimus?&rdquo; - Sofia Davis
            </blockquote>
          </div>
        </div>
        <img
          src="/baby.jpg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover brightness-[0.5]"
        />
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 flex-col gap-5 items-center justify-center">
          <div className="w-full max-w-lg">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
