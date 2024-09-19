import { NextApiRequest, NextApiResponse } from "next";
import { NextApiResponseServerIo } from "@/types";
import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const profile = await currentProfilePages(req);

    const { content, fileUrl } = req.body;
    const { channelId, serverId } = req.query;

    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (!serverId) {
      return res.status(400).json({ error: "Missing serverId" });
    }
    if (!channelId) {
      return res.status(400).json({ error: "Missing channelId" });
    }
    if (!content) {
      return res.status(400).json({ error: "Missing content" });
    }

    const server = await db.server.findUnique({
      where: {
        id: serverId as string,
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        members: true,
      },
    });

    if (!server) {
      return res.status(404).json({ error: "Server not found" });
    }

    const channel = await db.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: server.id as string,
      },
    });

    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    const member = server.members.find((member)=>member.profileId===profile.id);

    if(!member){
        return res.status(404).json({ error: "Member not found" });
    }

    const message = await db.message.create({
        data:{
            content,
            fileUrl,
            channelId:channelId as string,
            memberId:member.id
        },
        include:{
            member:{
                include:{
                    profile:true
                }
            }
        }
    })

    const channelKey = `chat:${channelId}:messages`;

    res?.socket?.server?.io?.emit(channelKey,message)

    return res.status(200).json({ message });
  } catch (error) {
    console.log("MESSAGE_POST", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
}
