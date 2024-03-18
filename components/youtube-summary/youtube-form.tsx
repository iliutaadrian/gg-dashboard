"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const projectFormSchema = z.object({
  link: z.string().max(150, {
    message: "Links cannot be larger than 150 chars",
  }),
});

type TranslateFormValues = z.infer<typeof projectFormSchema>;

const defaultValues: Partial<TranslateFormValues> = {
  // prompt: "do not translate golf related specific terms like Tee, Hole",
  // translate: "fr",
  // link: "https://www.youtube.com/watch?v=zIJ1qRCPHUw",
};

export const YoutubeForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState("");
  const [isMounted, setMounted] = useState(false);
  const { isSignedIn } = useUser();

  useEffect(() => {
    setMounted(true);
  }, []);

  const form = useForm<TranslateFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues,
  });

  if (!isMounted) return null;

  const onSubmit = async (data: TranslateFormValues) => {
    setIsLoading(true);
    if (!isSignedIn) {
      toast({
        description: "Please sign in to use this feature.",
      });
      setIsLoading(false);
      return;
    }

    const formData = {
      ...data,
      redo: false,
    };

    try {
      await axios
        .post("api/youtube-summary", {
          ...formData,
        })
        .then((data) => {
          window.location.href = `/summary/${data.data}`;
        });
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
        className="flex flex-col gap-10 w-full"
      >
        <FormField
          control={form.control}
          name="link"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Youtube Link</FormLabel>
              <Input placeholder="Please enter a youtube link" {...field} />
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full font-semibold"
        >
          Summarize
        </Button>

        {isLoading && (
          <Loader2 className="w-20 h-20 mx-auto text-primary animate-spin" />
        )}
      </form>
    </Form>
  );
};
