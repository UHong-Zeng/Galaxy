import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Alertbar({ text }: { text: string }) {
  return (
    <div className="pt-4">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{text}</AlertDescription>
      </Alert>
    </div>
  );
}
