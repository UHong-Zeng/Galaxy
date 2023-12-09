"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "../ui/label";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Switch } from "../ui/switch";
import { getPrivacy, togglePrivacy } from "@/lib/actions/user.actions";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

const Privacy = ({ userId }: { userId: string }) => {
  const [isPrivate, setIsPrivate] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  function changePrivacy() {
    const func = async() => {
      await togglePrivacy(userId, isPrivate).then(() => console.log("setPrivacy"));
    }
    func();
    setIsPrivate(() => !isPrivate);
  }

  useEffect(() => {
    const getState = async () => {
      const state = await getPrivacy(userId);
      setIsPrivate(() => state.privacy);
    }
    getState();
  }, [isPrivate]);

  return (
    <div>
      {/* Form */}

      <div>
        <h1 className="text-heading4-medium mb-2">
          Change your Privacy for map.
        </h1>
        <div className="flex items-center space-x-2 mb-2">
          <Switch
            id="airplane-mode"
            checked={isPrivate}
            onCheckedChange={changePrivacy}
          />
          <Label htmlFor="airplane-mode">
            {isPrivate ? "Private" : "Public"}
          </Label>
        </div>
        {isPrivate && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Enter name or username to your whitelist.
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Name or Username" {...field} />
                    </FormControl>
                    <FormDescription>Have a good day</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
};

export default Privacy;
