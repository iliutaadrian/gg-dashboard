"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { Settings } from "@/lib/db";

const projectFormSchema = z.object({
  imap: z.string(),
  email: z.string(),
  password: z.string(),
  api_key: z.string(),
  projects: z.string(),
});

type SettingsFormValues = z.infer<typeof projectFormSchema>;

interface Props {
  settings: Settings;
}
export const SettingsForm = ({ settings }: Props) => {
  console.log(settings);
  const [isLoading, setIsLoading] = useState(false);

  const defaultValues: Partial<SettingsFormValues> = {
    imap: "imap.gmail.com",
    email: settings.email,
    api_key: settings.api_key,
    projects: settings.projects.map((p) => p.value).join(","),
  };
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues,
  });

  const onSubmit = async (data: SettingsFormValues) => {
    setIsLoading(true);

    try {
      const response = await axios.post("/api/settings", {
        ...data,
      });

      if (response.status === 200) {
        toast({
          description: "Settings saved.",
        });
        window.location.reload();
      } else {
        toast({
          variant: "destructive",
          description: response.data,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        // @ts-ignore
        description: error.response.data,
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-7 max-w-3xl"
      >
        <div>
          <h2 className="text-xl font-medium tracking-tight">Email settings</h2>
          <p className="text-muted-foreground text-sm">
            Manage your email settings
          </p>
          <Separator className=" my-2" />
        </div>

        <FormField
          control={form.control}
          name="imap"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>IMAP Server</FormLabel>
              <FormDescription>
                We only support Gmail at this moment.
              </FormDescription>
              <Input type="text" value={field.value} disabled />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Email Address</FormLabel>
              <FormDescription>
                Input your email address that receives Jenkins reports.
              </FormDescription>
              <Input
                type="email"
                placeholder="Your email address..."
                {...field}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="api_key"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>API Key</FormLabel>
              <FormDescription>
                Get your API key from{" "}
                <a
                  href="https://support.google.com/googleapi/answer/6158862"
                  target="_blank"
                  rel="noreferrer"
                  className="underline cursor-pointer italic"
                >
                  Google API
                </a>
              </FormDescription>
              <Input
                type="password"
                placeholder="Your Google API Key..."
                {...field}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <h2 className="text-xl font-medium tracking-tight">
            Project Settings
          </h2>
          <p className="text-muted-foreground text-sm">
            Manage your project settings
          </p>
          <Separator className=" my-2" />
        </div>
        <FormField
          control={form.control}
          name="projects"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Add new project name</FormLabel>
              <FormDescription>
                Input your project name identical with the one in your emails.
                To add multiple projects, separate them with a comma.
                test_develop,test_jenkins,
              </FormDescription>
              <Input
                type="text"
                placeholder="Your Jenkins project name..."
                {...field}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <FormItem className="flex flex-col"> */}
        {/*   <FormLabel>Billing</FormLabel> */}
        {/*   <FormDescription> */}
        {/*     See your plan and billing information */}
        {/*   </FormDescription> */}
        {/*   <div>Your are on the free account plan.</div> */}
        {/*   <Button */}
        {/*     disabled={isLoading} */}
        {/*     variant="destructiveLight" */}
        {/*     onClick={(e) => { */}
        {/*       e.preventDefault(); */}
        {/*       toast({ description: "We are working on the paid plan!" }); */}
        {/*     }} */}
        {/*   > */}
        {/*     Upgrade */}
        {/*   </Button> */}
        {/*   <FormMessage /> */}
        {/* </FormItem> */}
        <div className="flex w-full gap-5">
          <Link
            href={"/"}
            className="shadow-neonLight w-full flex items-center justify-center rounded-md"
          >
            Back
          </Link>
          <Button
            className="w-full"
            isLoading={isLoading}
            onClick={(e) => {
              e.preventDefault();
              onSubmit(form.getValues());
            }}
          >
            Save Project
          </Button>
        </div>
      </form>
    </Form>
  );
};
