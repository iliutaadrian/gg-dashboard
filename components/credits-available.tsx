import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getUserApiLimit } from "@/lib/stripe/api-limits";
import { Zap } from "lucide-react";
import Link from "next/link";

export const CreditsAvailable = async () => {
  let limit = await getUserApiLimit();
  if (!limit) {
    limit = [0, 2];
  }

  return (
    <div className="flex flex-col mb-4 items-center">
      <div className="flex flex-col gap-3 items-center shadow-neon rounded-md p-4 m-4 w-[360px]">
        <p>
          {limit[0]}/{limit[1]}{" "}
          <span className="text-muted-foreground animate-pulse">
            Credits Available
          </span>
        </p>
        <Progress value={(limit[0] / limit[1]) * 100} />
        <Link href={`/#pricing`} className="w-full flex">
          <Button variant="premium" className="mx-auto">
            Get More Generations <Zap className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
};
