"use client"
import { ServerWithMembersWithProfiles } from '@/types';
import { Channel, ChannelType, MemberRole, Server } from '@prisma/client';
import ActionTooltip from '../action-tooltip';
import { Plus, Settings } from 'lucide-react';
import { useModal } from '@/hooks/use-modal-store';

interface ServerSectionProps{
    label:string;
    role?:MemberRole;
    sectionType:"channels"|"members";
    channelType?:ChannelType;
    server?:ServerWithMembersWithProfiles;
}

const ServerSection = ({label,role,channelType,sectionType,server}:ServerSectionProps) => {
    const {onOpen}=useModal();

  return (
<div className="flex items-center justify-between py-2">
    <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">{label}</p>
    {role!==MemberRole.GUEST&&sectionType==="channels"&&(
        <ActionTooltip label="Create Channel" side="top">
            <button onClick={()=>onOpen("createChannel",{channelType})} className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition">
                <Plus className="h-4 w-4"/>
            </button>
        </ActionTooltip>
        
    )}
    {role===MemberRole.ADMIN&&sectionType==="members"&&(
        <ActionTooltip label="Manage Member" side="top">
            <button onClick={()=>onOpen("members",{server})} className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition">
                <Settings className="h-4 w-4"/>
            </button>
        </ActionTooltip>
    )}
</div>
  )
}

export default ServerSection