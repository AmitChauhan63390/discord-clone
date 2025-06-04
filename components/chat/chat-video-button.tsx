"use client";

import qs from "query-string";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

import { Video, VideoOff } from "lucide-react";

import { ActionTooltip } from "../action-tooltip";

export const ChatVideoButton = () => {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // Check if 'video' query param exists and is true
    const isVideo = searchParams?.get("video");
    const Icon = isVideo ? VideoOff : Video;
    const tooltipLabel = isVideo ? "Turn off Video" : "Turn on Video";

    const onClick = () => {
        const url = qs.stringifyUrl({
            url: pathname || "",
            query: {
                video: isVideo ? undefined : true,  // Toggle video on or off
            },
        }, { skipNull: true });

        router.push(url);
    };

    return (
        <ActionTooltip side="bottom" label={tooltipLabel}>
            <button onClick={onClick} className="hover:opacity-75 transition mr-4">
                <Icon className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
            </button>
        </ActionTooltip>
    );
};
