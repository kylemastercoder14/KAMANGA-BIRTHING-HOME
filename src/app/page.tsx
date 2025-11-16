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
    <div className="min-h-screen bg-background">
      {/* HERO SECTION */}
      <div className="relative flex h-screen items-center justify-center bg-[url('/hero.jpeg')] bg-cover bg-center lg:bg-[50%_30%] px-6">
        {/* Dark overlay behind content but non-interactive */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80" />
        <div className="relative z-10 max-w-3xl text-center lg:text-left text-white space-y-6">
          <Badge
            variant="secondary"
            className="rounded-full py-1 border-border bg-white/90 text-foreground backdrop-blur shadow-sm"
            asChild
          >
            <Link href="#">
              Welcome to Barangay Kamanga Health Center{" "}
              <ArrowUpRight className="ml-1 size-4" />
            </Link>
          </Badge>
          <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tighter md:leading-[1.1]">
            Taking care of your health is our top priority
          </h1>
          <p className="md:text-lg text-white/90 max-w-2xl">
            Being healthy is more than just not getting sick. It entails mental,
            physical and social well-being. It&apos;s not just about treatment,
            it&apos;s about healing for our community.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 lg:flex-row">
            <Button
              onClick={() => router.push("#events")}
              size="lg"
              className="rounded-full text-base px-8"
            >
              View Events <ArrowUpRight className="ml-2 size-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full text-base border-white/60 bg-white/10 text-white hover:bg-white/20 shadow-none"
              onClick={() => router.push("#programs")}
            >
              <CirclePlay className="mr-2 size-5" /> Watch Video Programs
            </Button>
          </div>
        </div>
      </div>
      <section
        id="events"
        className="py-16 lg:py-24 lg:px-0 px-5 flex items-center justify-center bg-white border-t border-border/40"
      >
        <div className="w-full max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-[2.5rem] md:leading-[1.2] font-semibold tracking-[-0.03em] sm:max-w-xl text-pretty">
            Upcoming Events
          </h2>
          <p className="mt-2 text-muted-foreground text-lg sm:text-xl max-w-2xl">
            Browse all upcoming events in our community.
          </p>
          {loading ? (
            <div className="mt-8 text-center text-muted-foreground text-lg font-medium">
              Loading...
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border bg-card/60 shadow-sm backdrop-blur-sm p-4">
              <EventCalendar events={events} readOnly={true} />
            </div>
          )}
        </div>
      </section>
      <section
        id="programs"
        className="py-16 lg:py-24 lg:px-0 px-5 flex items-center justify-center bg-muted/40 border-t border-border/40"
      >
        <div className="w-full max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-[2.5rem] md:leading-[1.2] font-semibold tracking-[-0.03em] sm:max-w-xl text-pretty">
            Health Programs
          </h2>
          <p className="mt-2 text-muted-foreground text-lg sm:text-xl max-w-2xl">
            Browse all health programs in our community.
          </p>
          {loading ? (
            <div className="mt-8 text-center text-muted-foreground text-lg font-medium">
              Loading...
            </div>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
                    className="rounded-xl cursor-pointer overflow-hidden border bg-card relative group transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
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

      {/* FOOTER */}
      <footer className="border-t border-border bg-white shadow-xl py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-5 text-center text-sm text-muted-foreground sm:flex-row">
          <span className="font-medium tracking-wide">
            Developed by GOLDENSTATE COLLEGE OF MAASIM BSIT BATCH 2025
          </span>
          <span className="text-sm">
            © {new Date().getFullYear()} All rights reserved.
          </span>
        </div>
      </footer>
    </div>
  );
};

export default Page;
