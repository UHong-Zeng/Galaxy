"use client";

import { useEffect, useState } from "react";
import { Switch } from "../ui/switch";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  addUserLocationLicense,
  fetchUsersLocationLicense,
  getPrivacyState,
  togglePrivacy,
} from "@/lib/actions/userLocation.action";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserLocationValidation } from "@/lib/validations/userLocation";

const GPSPrivacy = ({ userId }: { userId: string }) => {
  const [isPrivate, setIsPrivate] = useState(false); //false -> Public, true -> Private.
  const [isOpen, setIsOpen] = useState(false);
  const [licenseNames, setLicenseNames] = useState<string[]>();

  useEffect(() => {
    const fetchPrivacyState = async () => {
      const privacyState = await getPrivacyState(userId);
      setIsPrivate(privacyState);
    };

    // const fetchLicenseList = async () => {
    //   const result = await fetchUsersLocationLicense(userId);
    //   // console.log(result);
    //   const list = result.map((item) => item.name);
    //   // console.log(list);
    //   setLicenseNames(list);
    //   // setLicenseNames(list);
    //   // console.log("List: ", list);
    // };

    fetchPrivacyState();
    // fetchLicenseList();
  }, [isPrivate, userId]);

  async function privacyChanger(checked: boolean) {
    setIsPrivate(checked);
    await togglePrivacy(userId, checked);
  }

  const form = useForm({
    resolver: zodResolver(UserLocationValidation),
    defaultValues: {
      target: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof UserLocationValidation>) => {
    console.log(values.target);
    await addUserLocationLicense(userId, values.target);
  };

  return (
    <div className="text-light-1 ">
      <div className="text-heading3-bold">GPS Privacy</div>
      <div className="pt-2 flex justify-start">
        <Switch
          className=""
          checked={isPrivate}
          onCheckedChange={privacyChanger}
        />
        <p className="text-body-semibold pl-2">
          {isPrivate ? "Private" : "Public"}
        </p>
      </div>

      {/* A from */}
      {isPrivate && (
        <div>
          {/* Input user */}
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-2/3 space-y-1"
              >
                <FormField
                  control={form.control}
                  name="target"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Access</FormLabel>
                      <FormControl>
                        <Input placeholder="User or Username" {...field} />
                      </FormControl>
                      <FormDescription>
                        Push other user to your whitelist.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Submit</Button>
              </form>
            </Form>
          </div>

          <div className="border-b border-primary-500 my-2"/>
          {/* Show a list of users */}
          <div>
            <Collapsible
              open={isOpen}
              onOpenChange={setIsOpen}
              className="w-[350px] space-y-2"
            >
              <div className="flex items-center justify-between space-x-4 px-4">
                <h4 className="text-sm font-semibold">
                  Show location to other users.
                </h4>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="w-9 p-0">
                    <ChevronsUpDown className="h-4 w-4" />
                    <span className="sr-only">Toggle</span>
                  </Button>
                </CollapsibleTrigger>
              </div>
              {/* 不會被隱藏區塊 */}
              {/* <div className="rounded-md border px-4 py-3 flex justify-start">
                <p className="flex-1 items-center py-1 text-body-medium">
                  User
                </p>
                <Button>
                  <Image
                    src={"/assets/delete.svg"}
                    alt="delete"
                    height="16"
                    width="16"
                  />
                </Button>
              </div> */}
              <CollapsibleContent className="space-y-2">
                {licenseNames?.map((name) => (
                  <div
                    className="rounded-md border pl-2 items-center flex justify-start"
                    key={name}
                  >
                    <p className="flex-1 items-center py-1 text-small-medium">
                      {name}
                    </p>
                    <Button>
                      <Image
                        src={"/assets/delete.svg"}
                        alt="delete"
                        height="14"
                        width="14"
                      />
                    </Button>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      )}
    </div>
  );
};

export default GPSPrivacy;
