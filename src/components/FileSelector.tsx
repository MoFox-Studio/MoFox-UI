import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Folder, LogOut } from "lucide-react";
import { toast } from "sonner";

interface FileSelectorProps {
  onFileSelect: (handle: FileSystemDirectoryHandle) => void;
  onLogout: () => void;
}

export function FileSelector({ onFileSelect, onLogout }: FileSelectorProps) {
  const [selectedDirectoryHandle, setSelectedDirectoryHandle] = useState<FileSystemDirectoryHandle | null>(null);

  const handleDirectoryBrowse = async () => {
    if ('showDirectoryPicker' in window) {
      try {
        const directoryHandle = await window.showDirectoryPicker();
        setSelectedDirectoryHandle(directoryHandle); // Store the handle, but don't proceed yet
        toast.success("已选择文件夹", { description: directoryHandle.name });
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          toast.info("已取消文件夹选择。");
        } else {
          console.error(error);
          toast.error("选择文件夹时出错", { description: "请确保您的浏览器支持 File System Access API 并已授予权限。" });
        }
      }
    } else {
      toast.error("浏览器不支持此功能", { description: "请使用支持 File System Access API 的现代浏览器（如 Chrome 或 Edge）。" });
    }
  };

  const handleConfirm = () => {
      if (selectedDirectoryHandle) {
          onFileSelect(selectedDirectoryHandle);
      } else {
          toast.warning("请先选择一个文件夹。");
      }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/10 p-4">
      <div className="w-full max-w-md space-y-4">
        <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>选择机器人目录</CardTitle>
            <CardDescription>
              请选择 MoFox Bot 的主目录，然后点击“确定”进入控制台。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={selectedDirectoryHandle?.name || ""}
                placeholder="请点击右侧按钮选择目录"
                className="flex-1"
                readOnly
              />
              <Button variant="outline" size="icon" onClick={handleDirectoryBrowse}>
                <Folder className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex justify-end gap-2 pt-2">
                <Button variant="ghost" onClick={onLogout}>返回登录</Button>
                <Button onClick={handleConfirm}>确定</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}