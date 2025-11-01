import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

interface StartupErrorDialogProps {
  isOpen: boolean;
  errorMessage: string;
}

export function StartupErrorDialog({ isOpen, errorMessage }: StartupErrorDialogProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(errorMessage);
    toast.success("错误报告已复制到剪贴板");
  };

  if (!isOpen) {
    return null;
  }

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>启动错误报告</AlertDialogTitle>
          <AlertDialogDescription>
            应用程序启动时遇到严重错误，部分或全部功能可能无法使用。请检查以下错误信息：
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="my-4 p-4 bg-muted rounded-md text-sm text-muted-foreground overflow-auto max-h-60">
          <pre className="whitespace-pre-wrap">{errorMessage}</pre>
        </div>
        <AlertDialogFooter>
          <Button variant="outline" onClick={handleCopy}>
            <Copy className="mr-2 h-4 w-4" />
            复制报告
          </Button>
          <AlertDialogAction>好的</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}