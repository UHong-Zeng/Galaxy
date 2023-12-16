"use client";

import { useState } from "react";
import { ChevronsUpDown, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Image from "next/image";
import { deleteLicense } from "@/lib/actions/user.actions";
import { typeOf } from "maplibre-gl";
import { currentUser } from "@clerk/nextjs";

const Whitelist = ({ userId, users }: { userId: string; users: any[] }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-[350px] space-y-2"
    >
      <div className="flex items-center justify-between space-x-4 px-4">
        <h4 className="text-heading4-medium font-semibold">Whitelist</h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-9 p-0">
            <ChevronsUpDown className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>

      {users && users.length > 0 && (
        <div className="rounded-md border px-4 py-3 font-mono text-sm flex flex-row justify-between">
          {users[0].name}
          <Image
            src="/assets/delete.svg"
            alt="delete"
            width={20}
            height={20}
            className="cursor-pointer object-contain"
            onClick={async () => {
              await deleteLicense(userId, users[0]._id.toString()).then(() => {
                window.location.reload();
              });
            }}
          />
        </div>
      )}

      {users.length > 1 && (
        <CollapsibleContent className="space-y-2">
          {users.slice(1).map((user) => (
            <div
              className="rounded-md border px-4 py-3 font-mono text-sm flex flex-row justify-between"
              key={user.name}
            >
              {user.name}
              <Image
                src="/assets/delete.svg"
                alt="delete"
                width={20}
                height={20}
                className="cursor-pointer object-contain"
                onClick={async () => {
                  await deleteLicense(userId, user._id.toString()).then(() => {
                    window.location.reload();
                  });
                }}
              />
            </div>
          ))}
        </CollapsibleContent>
      )}
    </Collapsible>
  );
};

export default Whitelist;
