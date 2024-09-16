import { ChatHeader } from '@/components/chat/chat-header';
import { getOrCreateConversation } from '@/lib/conversations';
import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import React from 'react'

interface MemberIdPageProps{
    params:{
        memberId:string;
        serverId:string;
    }
}

const MemberIdPage =async ({params}:MemberIdPageProps) => {


    const profile = await currentProfile();

    if(!profile) return redirect("/sign-in");

    const currentMember = await db.member.findFirst({
        where:{
            serverId:params.serverId,
            profileId:profile.id,
        },
        include:{
            profile:true,
        },

        
    })

    if(!currentMember) return redirect("/");

    const conversation=await getOrCreateConversation(currentMember.id,params.memberId);

    if(!conversation) return redirect(`/server/${params.serverId}`);

    const {memberOne,memberTwo}=conversation;

    const otherMember = memberOne.profileId===profile.id?memberTwo:memberOne;

  return (
    <div className='bg-white dark:bg-[#313338] flex flex-col h-full'>
        <ChatHeader imageUrl={otherMember.profile.imageUrl} name={otherMember.profile.name} serverId={params.serverId} type="conversations"/>
        
    </div>  
  )
}

export default MemberIdPage