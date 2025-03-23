import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Copy, Link2 } from "lucide-react";
import { useUrl } from "../context/url-context";
import { useToast } from "../hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

const formSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL" }),
});

export default function CreateLinkPage() {
  const { addUrl } = useUrl();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [shortUrl, setShortUrl] = useState(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
  });

  async function onSubmit(values) {
    setIsLoading(true);
    try {
      const newUrl = await addUrl(values.url);
      const shortUrl = `${window.location.origin}/${newUrl.short_url}`;
      setShortUrl(shortUrl);
      toast({
        title: "URL shortened",
        description: "Your URL has been shortened successfully.",
      });
    } catch (error) {
      console.log(error, "error");
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was an error shortening your URL.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const copyToClipboard = () => {
    if (shortUrl) {
      navigator.clipboard.writeText(shortUrl);
      toast({
        title: "URL copied",
        description: "The shortened URL has been copied to your clipboard.",
      });
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create Short URL</h1>
        <p className="text-muted-foreground">
          Shorten your long URLs for easier sharing
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Shorten a URL</CardTitle>
          <CardDescription>
            Enter a long URL to create a shortened version
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/very/long/url"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the URL you want to shorten
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Short URL"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {shortUrl && (
        <Card>
          <CardHeader>
            <CardTitle>Your Shortened URL</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="flex-1 rounded-md border p-2">
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-primary hover:underline"
                >
                  <Link2 className="mr-2 h-4 w-4" />
                  {shortUrl}
                </a>
              </div>
              <Button variant="outline" size="icon" onClick={copyToClipboard}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/")}
            >
              Back to Dashboard
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
