"use client";

import {
  IconDotsVertical,
  IconLogout,
  IconUserCircle,
} from "@tabler/icons-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import AlertModal from "@/components/ui/alert-modal";
import { signOut } from "@/actions";

export function NavUser({
  user,
}: {
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleLogout = async () => {
    setTimeout(() => {
      setIsRedirecting(true);
    }, 5000);
    await signOut(user.id);

    toast.success("Logged out successfully!");
    router.push("/sign-in");
    setIsRedirecting(false);
  };
  return (
    <>
      {isRedirecting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg font-medium">Logging out...</p>
          </div>
        </div>
      )}

      <AlertModal
        title="Log out"
        description="Are you sure you want to log out?"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleLogout}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex py-6 cursor-pointer hover:bg-zinc-200 items-center gap-3"
          >
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="rounded-lg">
                {user.name.charAt(0)} {user.name.charAt(1)}
              </AvatarFallback>
            </Avatar>
            <div className="lg:grid hidden flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.name}</span>
              <span className="text-muted-foreground truncate text-xs">
                {user.email}
              </span>
            </div>
            <IconDotsVertical className="ml-auto size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
          side="bottom"
          align="end"
          sideOffset={4}
        >
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">
                  {user.name.charAt(0)} {user.name.charAt(1)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {user.email}
                </span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => router.push("/my-account")}>
              <IconUserCircle />
              Account
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuItem onClick={() => setIsOpen(true)}>
            <IconLogout />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
