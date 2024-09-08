"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

import { Button } from "../ui/button";

import { FileUpload } from "../file-upload";

import { useModal } from "@/hooks/use-modal-store";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Copy, RefreshCcw, RefreshCw } from "lucide-react";
import { useOrigin } from "@/hooks/use-origin";

export const InviteModal = () => {
  const {isOpen,onClose,type} =useModal();
  const origin=useOrigin();

  const isModalOpen=isOpen&&type==="invite";

  const inviteUrl = `${origin}`;

 
  return (
    <div>
      <Dialog open={isModalOpen} onOpenChange={onClose} >
        <DialogContent className="bg-white text-black p-0 overflow-hidden">
          <DialogHeader className="pt-8 px-6">
            <DialogTitle className="font-bold text-2xl text-center text-zinc">
              Invite Friends
            </DialogTitle>
            
          </DialogHeader>
          <div className="p-6">
            <Label className="uppercase text-xs font-bol text-zinc-500 dark:text-secondary/70"
            >Server invite Link</Label>
            <div className="flex items-center mt-2 gap-x-2">
              <Input className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0" value={inviteUrl}/>
              <Button size="icon">
                <Copy className="w-4 h-4"/>
              </Button>
              

            </div>
            <Button variant="link" size="sm" className="text-xs text-zinc-500 mt-4">
                Generate a new link
                <RefreshCw className="w-4 h-4 ml-2"/>
              </Button>

          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};


