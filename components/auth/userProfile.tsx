"use client";
import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "../ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SingOutButton from "@/components/auth/signoutButton";
import { Separator } from "../ui/separator";
import { IconLogout2, IconUser } from "@tabler/icons-react";

type userData = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
};

type Props = {
  userDetails?: userData;
};

const UserProfile = ({ userDetails }: Props) => {
  return (
    <Popover>
      <PopoverTrigger asChild className="cursor-pointer">
        <Avatar>
          <AvatarImage src={userDetails?.image!} alt="@shadcn" />
          <AvatarFallback className="p-2">
            {userDetails?.name[0]}
          </AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent className="w-60 mt-2 mr-2">
        <div className="grid gap-4">
          <div className="grid gap-2 text-center">
            <Label className="flex items-center gap-2 justify-center cursor-pointer">
              <IconUser />
              Account
            </Label>
            <Separator className="my-2" />
            <Label className="cursor-pointer">
              <SingOutButton />
            </Label>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default UserProfile;
