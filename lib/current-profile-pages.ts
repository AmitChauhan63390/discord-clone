import { getAuth } from "@clerk/nextjs/server";
import { db } from "./db";
import { NextApiRequest } from "next";



export const currentProfilePages=async(req:NextApiRequest)=>{
    const {userId} =getAuth(req);

    console.log(userId)

    if(!userId){
        return null
    }

    const profile = await db.profile.findUnique({
        where:{
            userId
        }
    })
    return profile;
}