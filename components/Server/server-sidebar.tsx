import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ChannelType, MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { ServerHeader } from "./server-header";
import { ScrollArea } from "../ui/scroll-area";
import { ServerSearch } from "./server-search";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";
import { Separator } from "../ui/separator";
import ServerSection from "./server-section";
import { ServerChannel } from "./server-channel";
import { ServerMember } from "./server-member";

interface ServerSidebarProps{
    serverId:string;

}

export const ServerSidebar = async ({serverId}:ServerSidebarProps) => {
    const profile = await currentProfile();

    if(!profile){
        return redirect("/");
    }

    const server = await db.server.findUnique({
        where:{
            id:serverId,
        },
        include:{
            channels:{
                orderBy:{
                    createdAt:"asc",
                },
            },
            members:{
                include:{
                    profile:true,
                },
                orderBy:{
                    role:"asc",
                }
            }
        }

    })

    const iconMap ={
        [ChannelType.TEXT]:<Hash className="mr-2 h-4 w-4"/>,
        [ChannelType.AUDIO]:<Mic className="mr-2 h-4 w-4"/>,
        [ChannelType.VIDEO]:<Video className="mr-2 h-4 w-4"/>
    }
    
    const roleIconMap={
        [MemberRole.GUEST]:null,
        [MemberRole.MODERATOR]:<ShieldCheck className="text-indigo-500 mr-2 h-4 w-4 "/>,
        [MemberRole.ADMIN]:<ShieldAlert className="text-rose-500 mr-2 h-4 w-4 "/>
    }

    const textChannels = server?.channels.filter((channel)=>channel.type===ChannelType.TEXT);
    const AudioChannels = server?.channels.filter((channel)=>channel.type===ChannelType.AUDIO);
    const VideoChannels = server?.channels.filter((channel)=>channel.type===ChannelType.VIDEO);
    const members = server?.members.filter((member)=>member.profileId!==profile.id)

    if(!server) return redirect("/");

    const role = server.members.find((member)=>member.profileId===profile.id)?.role

  return (
    <div className=" flex flex-col w-full h-full text-primary  dark:bg-[#2B2D31] bg-[#f2f3f4]">
        <ServerHeader server={server} role={role}/>
        <ScrollArea className="flex-1 px-3">
            <div className="mt-2">
                <ServerSearch data={[
                    {
                        label:"Text Channels",
                        type:"channel",
                        data:textChannels?.map((channel)=>({
                            id:channel.id,
                            name:channel.name,
                            icon:iconMap[channel.type],
                            
                        }))
                    },
                    {
                        label:"Voice Channels",
                        type:"channel",
                        data:AudioChannels?.map((channel)=>({
                            id:channel.id,
                            name:channel.name,
                            icon:iconMap[channel.type],
                            
                        }))
                    },
                    {
                        label:"Video Channels",
                        type:"channel",
                        data:VideoChannels?.map((channel)=>({
                            id:channel.id,
                            name:channel.name,
                            icon:iconMap[channel.type],
                            
                        }))
                    },
                    {
                        label:"Members",
                        type:"member",
                        data:members?.map((member)=>({
                            id:member.id,
                            name:member.profile.name,
                            icon:roleIconMap[member.role],
                            
                        }))
                    }
                ]}/>

            </div>
            <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2"/>
            {!!textChannels?.length&&(
                <div className="mb-2">
                    <ServerSection sectionType="channels" channelType={ChannelType.TEXT} role={role} label="Text Channels" server={server}/>
                    {textChannels.map((channel)=>(
                        <ServerChannel key={channel.id} channel={channel} role={role} server={server}/>
                    ))}
                </div>
            )}
            {!!AudioChannels?.length&&(
                <div className="mb-2">
                    <ServerSection sectionType="channels" channelType={ChannelType.AUDIO} role={role} label="Voice Channels" server={server}/>
                    {AudioChannels.map((channel)=>(
                        <ServerChannel key={channel.id} channel={channel} role={role} server={server}/>
                    ))}
                </div>
            )}
            {!!VideoChannels?.length&&(
                <div className="mb-2">
                    <ServerSection sectionType="channels" channelType={ChannelType.VIDEO} role={role} label="Video Channels" server={server}/>
                    {VideoChannels.map((channel)=>(
                        <ServerChannel key={channel.id} channel={channel} role={role} server={server}/>
                    ))}
                </div>
            )}

            {!!members?.length&&(
                <div className="mb-2">
                    <ServerSection sectionType="members" channelType={ChannelType.AUDIO} role={role} label="Members" server={server}/>
                    {members.map((member)=>(
                        <ServerMember member={member} key={member.id} server={server}/>
                    ))}
                </div>
            )}
            

        </ScrollArea>
    </div>
  )
}

export default ServerSidebar