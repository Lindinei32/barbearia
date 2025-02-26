import { Avatar, AvatarImage, AvatarFallback } from "./avatar";
import { MenuIcon, UserIcon } from "lucide-react";
import { Button } from "./button";

interface UserAvatarProps {
  imageUrl?: string | null;
  name?: string | null;
  className?: string;
}

export function UserAvatar({ imageUrl, name, className }: UserAvatarProps) {
  return (
    <Button size="icon" aria-label="Abrir menu lateral">
      <MenuIcon />
    </Button>
  );
} 