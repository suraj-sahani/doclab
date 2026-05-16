"use client";

import { useSettingsStore } from "@/lib/store";
import { Dialog, DialogContent, DialogHeader } from "./ui/dialog";
import { Label } from "./ui/label";
import { ThemeToggle } from "./theme-toggle";

export default function SettingsModal() {
  const isOpen = useSettingsStore((store) => store.isOpen);

  const onClose = useSettingsStore((store) => store.onClose);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader className="border-b pb-3">
          <h2 className="text-lg font-medium">My settings</h2>
        </DialogHeader>
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col gap-y-1">
            <Label>Apperance</Label>
            <span className="text-[0.8rem] text-muted-foreground">
              Customize how Doclab looks on your device
            </span>
          </div>
          <ThemeToggle />
        </div>
      </DialogContent>
    </Dialog>
  );
}
