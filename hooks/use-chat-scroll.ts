import { use, useEffect, useState } from "react";

type ChatScrollProps={
    chatRef:React.RefObject<HTMLDivElement>;
    bottomRef:React.RefObject<HTMLDivElement>;
    shouldLoadMore:boolean;
    loadMore:()=>void;
    count:number;
}

export const useChatScroll = ({
    chatRef,
    bottomRef,
    shouldLoadMore,
    loadMore,
    count,
}:ChatScrollProps)=>{
    const [hasInitialized,setHasInitialized]=useState(false);
    useEffect(()=>{
        const topDiv = chatRef?.current;
        const handleScroll = ()=>{
            const scrollTop = topDiv?.scrollTop;
            if(scrollTop===0&&shouldLoadMore){
                loadMore();
            }
        };

        topDiv?.addEventListener("scroll",handleScroll);
        return ()=>{
            topDiv?.removeEventListener("scroll",handleScroll);
        }
    },[chatRef,shouldLoadMore,loadMore,count])

    useEffect(()=>{
        const bottomDiv = bottomRef?.current;
        const topDiv = chatRef?.current;
        const shouldAutoScroll =()=>{
            if(!hasInitialized&&bottomDiv){
                setHasInitialized(true);
                return true;
            }
            if(!topDiv){
                return false;
            }

            const distancefromBottom = topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight;
            return distancefromBottom<=100;
        }
        if(shouldAutoScroll()){
            setTimeout(()=>bottomDiv?.scrollIntoView({behavior:"smooth"}),100)
        }
    },[hasInitialized,bottomRef,chatRef,count])

}
    