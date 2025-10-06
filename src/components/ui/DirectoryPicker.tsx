import { Input } from "./input";
import { Button } from "./button";
import { Folder } from "lucide-react";
import { toast } from "sonner";

interface DirectoryPickerProps {
  value: string;
  onPathSelect: (path: string) => void;
  dialogOptions?: {
    title?: string;
    buttonLabel?: string;
    // These are common properties used in Electron's showOpenDialog
    properties?: ('openFile' | 'openDirectory' | 'multiSelections' | 'showHiddenFiles' | 'createDirectory')[];
  };
}

/**
 * A component for selecting a file or directory path.
 * In a real Electron application, this would trigger Electron's native dialog.
 */
export function DirectoryPicker({ value, onPathSelect, dialogOptions }: DirectoryPickerProps) {

  const handleBrowse = async () => {
    const useDirectoryPicker = dialogOptions?.properties?.includes('openDirectory');

    try {
      if (useDirectoryPicker && 'showDirectoryPicker' in window) {
        const handle = await window.showDirectoryPicker();
        onPathSelect(handle.name); // We only get the name, not the full path
        toast.success("已选择目录", { description: handle.name });
      } else if (!useDirectoryPicker && 'showOpenFilePicker' in window) {
        const [handle] = await window.showOpenFilePicker();
        const file = await handle.getFile();
        onPathSelect(file.name); // We only get the name, not the full path
        toast.success("已选择文件", { description: file.name });
      } else {
        throw new Error("浏览器不支持 File System Access API");
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        toast.info("已取消选择。");
      } else {
        console.error(error);
        toast.error("选择失败", {
          description: "请确保浏览器支持并已授予文件系统访问权限。"
        });
        // Fallback for unsupported browsers or errors
        const path = prompt("请手动输入路径:", value);
        if (path !== null) {
            onPathSelect(path);
        }
      }
    }
  };

  return (
    <div className="flex gap-2">
      <Input
        value={value || ""}
        placeholder="点击右侧按钮选择路径"
        className="flex-1"
        // Making it editable for cases where user wants to paste a path
        onChange={(e) => onPathSelect(e.target.value)}
      />
      <Button variant="outline" size="icon" onClick={handleBrowse}>
        <Folder className="h-4 w-4" />
      </Button>
    </div>
  );
}