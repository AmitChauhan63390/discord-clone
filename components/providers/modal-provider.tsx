"use client";

import { useEffect, useState } from "react"
import {CreateServerModal} from "../modals/create-server-modal"
import { InviteModal } from "../modals/invite-modal";
import { EditServerModal } from "../modals/edit-server-modal";
import { MembersModal } from "../modals/members-modal";
import { CreateChannelModal } from "../modals/create-channel-modal";



export const ModalProvider=()=>{
    const [isMounted,setIsMounted]=useState(false);
    
    useEffect(()=>{
        setIsMounted(true)
    },[])

    if(!isMounted) {
        return null;
    }

    return (
        <>
        <CreateServerModal/>
        <InviteModal/>
        <EditServerModal/>
        <MembersModal/>
        <CreateChannelModal/>
        </>
    )
}