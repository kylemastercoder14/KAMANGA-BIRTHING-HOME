"use client";

import { useRef, useState, useEffect } from "react";
import { Play, Pause, Volume2, Maximize, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProgramSection } from '@prisma/client';

export function VideoPlayer({ section }: { section: ProgramSection }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const videoUrl =
    section?.videoUrl ||
    "https://videos.pexels.com/video-files/3195390/3195390-hd_1920_1080_25fps.mp4";

  const isYouTube =
    videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be");

  const getYouTubeEmbedUrl = (url: string) => {
    const videoIdMatch = url.match(/(?:youtu\.be\/|v=)([^?&]+)/);
    const videoId = videoIdMatch ? videoIdMatch[1] : "";
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
  };

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    setProgress(video.currentTime);
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;
    setDuration(video.duration);
  };

  const handleFullscreen = () => {
    const video = videoRef.current;
    if (video && video.requestFullscreen) {
      video.requestFullscreen();
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const handleEnded = () => setIsPlaying(false);
    video.addEventListener("ended", handleEnded);
    return () => video.removeEventListener("ended", handleEnded);
  }, []);

  return (
    <Card className="overflow-hidden py-0">
      <div className="relative aspect-video bg-black">
        {isYouTube ? (
          <iframe
            src={getYouTubeEmbedUrl(videoUrl)}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video
            ref={videoRef}
            src={videoUrl}
            className="h-full w-full object-cover"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
          />
        )}

        {!isYouTube && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end">
            <div className="w-full bg-white/20 h-1">
              <div
                className="bg-primary h-1"
                style={{ width: `${(progress / duration) * 100 || 0}%` }}
              />
            </div>

            <div className="flex items-center justify-between p-4 text-white">
              <div className="flex items-center gap-3">
                <Button
                  size="sm"
                  variant="secondary"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={handlePlayPause}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <span className="text-sm font-medium">
                  {formatTime(progress)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                  <Volume2 className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                  <Settings className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={handleFullscreen}
                >
                  <Maximize className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
