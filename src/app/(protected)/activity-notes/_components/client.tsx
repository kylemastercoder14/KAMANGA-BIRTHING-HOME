"use client";

import { Notes } from "@prisma/client";
import { Loader2, Search } from "lucide-react";
import React, { useState, useTransition, useMemo } from "react";
import { Input } from "@/components/ui/input";
import CreateNotes from "./create-notes";
import { IconFilter } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  IconEdit,
  IconPin,
  IconDownload,
  IconShare,
  IconPalette,
  IconTrash,
  IconPinFilled,
} from "@tabler/icons-react";
import { colorOptions } from "@/constants";
import RadioColor from "@/components/ui/radio-color";
import { useRouter } from "next/navigation";
import { deleteNote, updateNoteColor, updateNotePin } from "@/actions";
import { Modal } from "@/components/ui/modal";
import NotesForm from "@/components/forms/notes";
import AlertModal from "@/components/ui/alert-modal";
import { toast } from 'sonner';

import { Role } from "@prisma/client";

const Client = ({
  data,
  userId,
  userRole
}: {
  data: Notes[];
  userId: string;
  userRole?: Role;
}) => {
  const isAdmin = userRole === Role.ADMIN;
  const router = useRouter();
  const [expandedNotes, setExpandedNotes] = useState<Record<string, boolean>>(
    {}
  );
  const [selectedColors, setSelectedColors] = useState<Record<string, string>>(
    () =>
      data.reduce((acc, note) => {
        acc[note.id] = note.color || "default";
        return acc;
      }, {} as Record<string, string>)
  );
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  const [selectedNote, setSelectedNote] = useState<Notes | null>(null);

  // 🟩 Search & Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTag, setActiveTag] = useState("All");

  // 🟦 Local pin state
  const [pinnedNotes, setPinnedNotes] = useState<Record<string, boolean>>(() =>
    data.reduce((acc, note) => {
      acc[note.id] = note.isPinned;
      return acc;
    }, {} as Record<string, boolean>)
  );

  const toggleExpand = (id: string) => {
    setExpandedNotes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // 🎨 Color Change (already works)
  const handleColorChange = (noteId: string, color: string) => {
    if (!isAdmin) {
      toast.error("Unauthorized: Only administrators can update notes");
      return;
    }
    setSelectedColors((prev) => ({ ...prev, [noteId]: color }));
    startTransition(async () => {
      await updateNoteColor(noteId, color);
      router.refresh();
    });
  };

  // 📌 Handle Pin Toggle
  const handleTogglePin = (noteId: string) => {
    if (!isAdmin) {
      toast.error("Unauthorized: Only administrators can update notes");
      return;
    }
    const newPinnedState = !pinnedNotes[noteId];
    setPinnedNotes((prev) => ({ ...prev, [noteId]: newPinnedState }));

    startTransition(async () => {
      await updateNotePin(noteId, newPinnedState);
      router.refresh();
    });
  };

  const handleDownload = (note: Notes) => {
    const blob = new Blob(
      [
        `Title: ${note.template || "Untitled Note"}\n\n${note.content
          .replace(/<[^>]*>?/gm, "") // strip HTML tags
          .trim()}`,
      ],
      { type: "text/plain;charset=utf-8" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${note.template || "note"}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async (note: Notes) => {
    const shareData = {
      title: note.template || "Note",
      text: note.content.replace(/<[^>]*>?/gm, "").slice(0, 200), // short preview
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        toast.warning("Sharing is not supported in this browser.");
      }
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  const handleDelete = async () => {
    if (!noteToDelete) return;
    if (!isAdmin) {
      toast.error("Unauthorized: Only administrators can delete notes");
      setIsDeleteOpen(false);
      setNoteToDelete(null);
      return;
    }

    startTransition(async () => {
      try {
        await deleteNote(noteToDelete);
        setIsDeleteOpen(false);
        setNoteToDelete(null);
        router.refresh();
      } catch (error) {
        console.error("Failed to delete note:", error);
        toast.error("Failed to delete note. Please try again.");
      }
    });
  };

  // 🎯 Filtered Notes
  const filteredNotes = useMemo(() => {
    return data
      .filter((note) => {
        const matchesSearch =
          note.template?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note.content?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesTag =
          activeTag === "All" ||
          note.tags?.some(
            (tag) => tag.toLowerCase() === activeTag.toLowerCase()
          );

        return matchesSearch && matchesTag;
      })
      .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0)); // pinned notes first
  }, [data, searchTerm, activeTag]);

  // 🎨 Color Map
  const colorMap: Record<string, { bg: string; border: string }> = {
    yellow: { bg: "bg-yellow-200", border: "border-yellow-500" },
    teal: { bg: "bg-teal-200", border: "border-teal-500" },
    sky: { bg: "bg-sky-200", border: "border-sky-500" },
    purple: { bg: "bg-purple-200", border: "border-purple-500" },
    pink: { bg: "bg-pink-200", border: "border-pink-500" },
    green: { bg: "bg-green-200", border: "border-green-500" },
    orange: { bg: "bg-orange-200", border: "border-orange-500" },
    default: { bg: "bg-gray-200", border: "border-gray-500" },
  };

  const uniqueTags = Array.from(
    new Set(data.flatMap((note) => note.tags || []))
  );

  return (
    <>
      <AlertModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
      />
      <Modal
        className="max-w-5xl!"
        title="Update activity note"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <NotesForm
          initialData={selectedNote}
          userId={userId}
          onClose={() => setIsOpen(false)}
        />
      </Modal>
      <div>
        {/* Search + Filter Section */}
        <div className="p-3 border rounded-sm bg-accent">
          <div className="flex items-center gap-2">
            <div className="relative w-full bg-secondary dark:bg-transparent flex items-center rounded-md border focus-within:ring-1 focus-within:ring-ring pl-2">
              <Search className="h-5 w-5 text-black" />
              <Input
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-0 placeholder:text-black dark:placeholder:text-white dark:text-white text-black focus-visible:ring-0 shadow-none"
              />
            </div>
            <CreateNotes userId={userId} />
          </div>

          {/* Filter Tags */}
          <div className="flex items-center mt-2 gap-4">
            <IconFilter className="size-5" />
            <div className="flex flex-wrap gap-2">
              <Badge
                onClick={() => setActiveTag("All")}
                className={`cursor-pointer ${
                  activeTag === "All"
                    ? "bg-primary text-white"
                    : "dark:bg-green-700 dark:text-white bg-secondary text-black"
                }`}
              >
                All
              </Badge>

              {uniqueTags.map((tag) => (
                <Badge
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className={`cursor-pointer ${
                    activeTag === tag
                      ? "bg-primary text-white"
                      : "dark:bg-green-700 dark:text-white bg-secondary text-black"
                  }`}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Notes Grid */}
        <div className="flex mt-5 flex-wrap items-start gap-5">
          {filteredNotes.length === 0 ? (
            <p className="text-center w-full text-gray-500">No notes found.</p>
          ) : (
            filteredNotes.map((note) => {
              const color = selectedColors[note.id] || note.color;
              const { bg, border } = colorMap[color] || colorMap.default;
              const isExpanded = expandedNotes[note.id];
              const isPinned = pinnedNotes[note.id];

              return (
                <div
                  key={note.id}
                  className={`relative rounded-sm w-[379px] min-h-[500px] p-4 border-2 ${border} ${bg} text-black shadow-md flex flex-col justify-between transition-colors duration-300`}
                >
                  {/* 📍 Pin indicator */}
                  {isPinned && (
                    <div className="absolute top-2 right-2">
                      <IconPinFilled className="size-5 text-blue-700" />
                    </div>
                  )}

                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-semibold line-clamp-2">
                      {note.template || "Untitled Note"}
                    </h3>
                    <div className="flex gap-2 flex-wrap">
                      {note.tags?.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="bg-black/30 text-black border-0"
                        >
                          {tag.trim()}
                        </Badge>
                      ))}
                    </div>

                    <div
                      className={`my-3 text-sm prose prose-sm max-w-none prose-headings:font-bold prose-headings:text-black prose-a:text-black prose-ul:list-disc prose-li:marker:text-black ${
                        isExpanded ? "" : "line-clamp-7"
                      }`}
                      dangerouslySetInnerHTML={{ __html: note.content }}
                    />

                    {note.content && note.content.length > 250 && (
                      <button
                        onClick={() => toggleExpand(note.id)}
                        className="text-sm text-blue-800 font-medium hover:underline self-start"
                      >
                        {isExpanded ? "View Less" : "View More"}
                      </button>
                    )}
                  </div>

                  <div className="border-t border-black/20 mt-3 pt-2 flex justify-between items-center">
                    <div className="flex gap-3 text-black/80">
                      {isAdmin && (
                        <IconEdit
                          className="size-4 cursor-pointer hover:text-black"
                          onClick={() => {
                            setSelectedNote(note);
                            setIsOpen(true);
                          }}
                        />
                      )}
                      {isAdmin && (
                        isPending ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : isPinned ? (
                          <IconPinFilled
                            className="size-4 cursor-pointer text-blue-700 hover:text-black"
                            onClick={() => handleTogglePin(note.id)}
                          />
                        ) : (
                          <IconPin
                            className="size-4 cursor-pointer hover:text-black"
                            onClick={() => handleTogglePin(note.id)}
                          />
                        )
                      )}
                      <IconDownload
                        className="size-4 cursor-pointer hover:text-black"
                        onClick={() => handleDownload(note)}
                      />
                      <IconShare
                        className="size-4 cursor-pointer hover:text-black"
                        onClick={() => handleShare(note)}
                      />
                      {isAdmin && (
                        <Popover>
                          <PopoverTrigger>
                            {isPending ? (
                              <Loader2 className="size-4 animate-spin" />
                            ) : (
                              <IconPalette className="size-4 cursor-pointer hover:text-black" />
                            )}
                          </PopoverTrigger>
                          <PopoverContent side="top">
                            <RadioColor
                              options={colorOptions}
                              value={selectedColors[note.id]}
                              onChange={(color) =>
                                handleColorChange(note.id, color)
                              }
                            />
                          </PopoverContent>
                        </Popover>
                      )}
                      {isAdmin && (
                        <IconTrash
                          className="size-4 cursor-pointer text-destructive"
                          onClick={() => {
                            setNoteToDelete(note.id);
                            setIsDeleteOpen(true);
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default Client;
