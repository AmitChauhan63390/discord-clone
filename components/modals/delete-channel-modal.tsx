

"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

import { Button } from "../ui/button";



import { useModal } from "@/hooks/use-modal-store";

import { useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";


import qs from "query-string";



export const DeleteChannelModal = () => {
  const {isOpen,onClose,type,data} =useModal();
  
  
  const isModalOpen=isOpen&&type==="deleteChannel";

  const {server,channel}=data;

  const [isLoading,setIsLoading]=useState(false);
  const router=useRouter();

  

  const onClick=async()=>{
    try {
      setIsLoading(true)
      const url  = qs.stringifyUrl({
        url: `/api/channels/${channel?.id}`,
        query: {
          serverId:server?.id
        }
      })
      await axios.delete(url)
      onClose();
      router.refresh();
      router.push(`/server/${server?.id}`)
    } catch (error) {
      console.log("Leaver server error",error)
    }
      
  }

  

 
  return (
    <div>
      <Dialog open={isModalOpen} onOpenChange={onClose} >
        <DialogContent className="bg-white text-black p-0 overflow-hidden">
          <DialogHeader className="pt-8 px-6">
            <DialogTitle className="font-bold text-2xl text-center text-zinc">
              Delete Channel
            </DialogTitle>
            <DialogDescription className="text-center text-zinc-500">
              Are you sure you want to delete <span className="font-semibold text-indigo-500">{channel?.name}</span>?
            </DialogDescription>
            
          </DialogHeader>
          <DialogFooter className="bg-gray-100 px-6 py-4">
            <div className="flex items-center justify-between w-full">
              <Button onClick={()=>onClose()} disabled={isLoading} variant="ghost">
                
                Cancel
              </Button>
              <Button onClick={onClick} disabled={isLoading} variant="primary">
                Confirm
              </Button>


            </div>

          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};



