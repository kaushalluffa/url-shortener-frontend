import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link2 } from "lucide-react";
import { useUrl } from "../context/url-context";

export default function RedirectPage() {
  const { shortCode } = useParams<{ shortCode: string }>();
  const { getUrl, incrementClicks } = useUrl();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3);
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!shortCode) {
      navigate("/");
      return;
    }

    const urlData = getUrl(shortCode);
    if (!urlData) {
      navigate("/");
      return;
    }

    setUrl(urlData.originalUrl);
    incrementClicks(shortCode);

    // Start countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = urlData.originalUrl;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [shortCode, getUrl, incrementClicks, navigate]);

  if (!url) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="flex justify-center">
          <div className="rounded-full bg-primary/10 p-4">
            <Link2 className="h-10 w-10 text-primary" />
          </div>
        </div>
        <h1 className="text-2xl font-bold">
          Redirecting you in {countdown} seconds
        </h1>
        <p className="text-muted-foreground">You are being redirected to:</p>
        <div className="rounded-md border p-4">
          <a href={url} className="break-all text-primary hover:underline">
            {url}
          </a>
        </div>
        <p className="text-sm text-muted-foreground">
          If you are not redirected automatically, click the link above.
        </p>
      </div>
    </div>
  );
}
