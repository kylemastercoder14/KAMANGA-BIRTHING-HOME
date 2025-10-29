"use client";

import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowUpRight, CirclePlay } from "lucide-react";
import { useRouter } from "next/navigation";
import { EventCalendar } from "./(protected)/upcoming-events/_components";
import { Events } from "@prisma/client";
import { getAllPrograms, getEvents } from "@/actions";
import { HealthProgramWithSections } from "@/types";
import Image from "next/image";
import { formatDistanceToNowStrict } from "date-fns";

const Page = () => {
  const router = useRouter();
  const [events, setEvents] = useState<Events[]>([]);
  const [programs, setPrograms] = useState<HealthProgramWithSections[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const fetchedEvents = await getEvents();
        setEvents(fetchedEvents);
      } catch (error) {
        console.error("Error loading events:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchPrograms = async () => {
      try {
        const fetchedPrograms = await getAllPrograms();
        setPrograms(fetchedPrograms);
      } catch (error) {
        console.error("Error loading programs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
    fetchEvents();
  }, []);

  const formatDuration = (minutes: number) => {
    if (!minutes) return "0:00";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) return `${hours}:${mins.toString().padStart(2, "0")}:00`;
    return `${mins}:00`;
  };
  return (
    <div className="h-screen relative">
      <div className="bg-[url('/barangay.jpg')] h-screen bg-cover relative flex items-center justify-center px-6">
        <div className="bg-black/50 fixed inset-0 -z-1 size-full"></div>
        <div className="text-center max-w-3xl">
          <Badge
            variant="secondary"
            className="rounded-full py-1 border-border"
            asChild
          >
            <Link href="#">
              Welcome to Barangay Kamanga Health Center{" "}
              <ArrowUpRight className="ml-1 size-4" />
            </Link>
          </Badge>
          <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl text-white lg:text-7xl md:leading-[1.2] font-semibold tracking-tighter">
            Taking care of your health is our top priority
          </h1>
          <p className="mt-6 md:text-lg text-white">
            Being healthy is more than just not getting sick. It entails mental,
            physical and social well-being. It&apos;s not just about treatment,
            it&apos;s about healing for our community.
          </p>
          <div className="mt-12 flex lg:flex-row flex-col items-center justify-center gap-4">
            <Button
              onClick={() => router.push("#events")}
              size="lg"
              className="rounded-full text-base"
            >
              View Events <ArrowUpRight className="size-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full text-base shadow-none"
              onClick={() => router.push("#programs")}
            >
              <CirclePlay className="size-5" /> Watch Video Programs
            </Button>
          </div>
        </div>
      </div>
      <section
        id="events"
        className="py-10 lg:px-0 px-5 flex items-center justify-center bg-white"
      >
        <div className="w-full max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-[2.5rem] md:leading-[1.2] font-semibold tracking-[-0.03em] sm:max-w-xl text-pretty">
            Upcoming Events
          </h2>
          <p className="mt-2 mb-5 text-muted-foreground text-lg sm:text-xl">
            Browse all upcoming events in our community.
          </p>
          {loading ? (
            <div className="text-center text-white text-2xl font-bold">
              Loading...
            </div>
          ) : (
            <EventCalendar events={events} />
          )}
        </div>
      </section>
      <section
        id="programs"
        className="py-10 lg:px-0 px-5 flex items-center justify-center bg-white"
      >
        <div className="w-full max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-[2.5rem] md:leading-[1.2] font-semibold tracking-[-0.03em] sm:max-w-xl text-pretty">
            Health Programs
          </h2>
          <p className="mt-2 mb-5 text-muted-foreground text-lg sm:text-xl">
            Browse all health programs in our community.
          </p>
          {loading ? (
            <div className="text-center text-white text-2xl font-bold">
              Loading...
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {programs.length === 0 && (
                <p className="text-muted-foreground col-span-full text-center">
                  No programs found.
                </p>
              )}

              {programs.map((program) => {
                const totalDuration = program.sections.reduce(
                  (acc, sec) => acc + (sec.totalDuration || 0),
                  0
                );

                return (
                  <div
                    onClick={() =>
                      router.push(`/health-program/${program.id}`)
                    }
                    key={program.id}
                    className="rounded-xl cursor-pointer overflow-hidden hover:shadow-lg border transition-shadow relative group"
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-video bg-muted">
                      {program.thumbnailUrl ? (
                        <Image
                          src={program.thumbnailUrl}
                          alt={program.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                          No Thumbnail
                        </div>
                      )}
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs font-medium px-2 py-0.5 rounded">
                        {formatDuration(totalDuration)}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold leading-tight line-clamp-2 mb-1">
                            {program.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {program.instructor}
                          </p>
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground mt-1">
                        {program.viewsCount.toLocaleString()} views •{" "}
                        {formatDistanceToNowStrict(
                          new Date(program.createdAt),
                          {
                            addSuffix: true,
                          }
                        )}
                      </p>

                      {program.tags && program.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {program.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded-full font-medium"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Page;
