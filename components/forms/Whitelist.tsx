"use client";

import { useState } from "react";
import { ChevronsUpDown, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const Whitelist = ({ users }: { users: any[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  console.log(users);

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
        <div className="rounded-md border px-4 py-3 font-mono text-sm">
          {users[0].name}
        </div>
      )}

      {users.length > 1 && (
        <CollapsibleContent className="space-y-2">
          {users.slice(1).map((user) => (
            <div className="rounded-md border px-4 py-3 font-mono text-sm">
              {user.name}
            </div>
          ))}
        </CollapsibleContent>
      )}
    </Collapsible>
  );
};

export default Whitelist;
