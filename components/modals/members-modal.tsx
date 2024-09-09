"use client";

import { ServerWithMembersWithProfiles } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import qs from "query-string";

import { useModal } from "@/hooks/use-modal-store";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "@/lib/utils";
import { Check, Gavel, Loader2, MoreVertical, Shield, ShieldAlert, ShieldCheck, ShieldQuestion, User } from "lucide-react";
import { UserAvatar } from "../user-avatar";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { MemberRole } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";

export const MembersModal = () => {
  const router=useRouter();
  const {onOpen,isOpen,onClose,type,data} =useModal();
 

  const isModalOpen=isOpen&&type==="members";

  const {server}=data as {server:ServerWithMembersWithProfiles};
  const [loadingId,setloadingId]=useState("");
  
  const roleIconMap = {
    "GUEST":null,
    "MODERATOR":<ShieldCheck className="h-4 w-4 text-indigo-500"/>,
    "ADMIN":<ShieldAlert className="h-4 w-4 text-rose-500 "/>,
  }

  const onKick=async(memberId:string)=>{
    try {
      setloadingId(memberId)
      const url=qs.stringifyUrl({
        url:`/api/members/${memberId}`,
        query:{
          serverId:server?.id,
          
        }
      })

      const response = await axios.delete(url)

      router.refresh();
      onOpen("members",{server:response.data})
      
    } catch (error) {
      console.log(error)
      
    } finally{
      setloadingId("")
    }
  }
  const onRoleChange=async(memberId:string,role:MemberRole)=>{
    try {
      setloadingId(memberId)

      const url = qs.stringifyUrl({
        url:`/api/members/${memberId}`,
        query:{
          serverId:server?.id,
          

        }
      })

      const response =await axios.patch(url,{role});

      

      router.refresh();

      onOpen("members",{server:response.data});

      
    } catch (error) {
      console.log(error)
      
    }finally{
      setloadingId("")
    }
  }


  

 

 
  return (
    <div>
      <Dialog open={isModalOpen} onOpenChange={onClose} >
        <DialogContent className="bg-white text-black overflow-hidden">
          <DialogHeader className="pt-8 px-6">
            <DialogTitle className="font-bold text-2xl text-center text-zinc">
              Manage Members
            </DialogTitle>
            
          <DialogDescription className="text-center text-zinc-500">

            {server?.members?.length} Members
            
          </DialogDescription>
          </DialogHeader>
         <ScrollArea className="mt-8 max-h-[420px] pr-6 ">
          {server?.members?.map((member)=>(
            <div key={member.id} className=" flex items-center gap-x-2 mb-6">
              <UserAvatar src={member.profile.imageUrl}/>

              <div className="flex flex-col gap-y-1 ">
                <div className="text-xs font-semibold flex text-center gap-x-1">
                  {member.profile.name}
                  {roleIconMap[member.role]}

                </div>
                <p className="text-xs text-zinc-500 ">{member.profile.email}</p>


              </div>
              {server.profileId!==member.profileId&&loadingId!==member.id&&(
                <div className="ml-auto">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreVertical className="text-zinc-500 h-4 w-4"/>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="left">
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="flex items-center ">
                          <ShieldQuestion className="w-4 h-4 mr-2"/>
                          <span>Role</span>

                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                          <DropdownMenuItem onClick={()=>onRoleChange(member.id,"GUEST")}>
                            <Shield className="h-4 w-4 mr-2"/>
                            Guest
                            {member.role==="GUEST"&&(
                              <Check className="h-4 w-4 ml-auto"/>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={()=>onRoleChange(member.id,"MODERATOR")}>
                            <ShieldCheck className="h-4 w-4 mr-2"/>
                            Moderator
                            {member.role==="MODERATOR"&&(
                              <Check className="h-4 w-4 ml-auto"/>
                            )}
                          </DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                      <DropdownMenuSeparator/>

                      <DropdownMenuItem onClick={()=>onKick(member.id)} className="text-rose-500">
                        <Gavel className="h-4 w-4 mr-2"/>
                        Kick
                        
                      </DropdownMenuItem>

                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
              )}
              {loadingId===member.id&&(
                <Loader2 className="animate-spin text-zinc-500 ml-auto w-4 h-4"/>
              )}


            </div>
            
          ))}

         </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};


