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
              Barangay Kamanga Health Station Management System
            </span>
          </div>
          <div className="relative z-20 mt-auto max-w-3xl text-white/70">
            <blockquote className="leading-normal text-balance">
              &ldquo;Committed to serving the health needs of every family in Barangay Kamanga. Our digital profiling system ensures accurate health records, timely maternal care, proper child nutrition monitoring, and accessible health programs for all residents.&rdquo; - Barangay Kamanga
            </blockquote>
          </div>
        </div>
        <img
          src="/baby.jpg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover brightness-[0.5]"
        />
      </div>
      <div className="flex bg-[url('/fam1.jpg')] bg-cover flex-col gap-4">
        <div className="flex flex-1 flex-col backdrop-blur-sm gap-5 items-center justify-center">
          <div className="w-full lg:px-0 px-5 max-w-lg">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
