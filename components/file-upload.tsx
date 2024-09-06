"use client"
import { UploadDropzone } from "@/lib/uploadthing";
import "@uploadthing/react/styles.css";
import { X } from "lucide-react";
import Image from "next/image";


interface FileUploadProps{
    onChange:(url?:string)=>void;
    value:string;
    endpoint:"messageFile"|"serverImage"
}
export const FileUpload=({onChange,value,endpoint}:FileUploadProps)=>{

    const FileType = value?.split(".").pop();
    if(value&&FileType!=="pdf"){
        return (
            <div className="relative h-20 w-20 rounded-full">
            <Image
            src={value}
            alt="image"
            height={100}
            width={100}
            className="object-cover"
            />
            <button onClick={()=>onChange("")} className="bg-rose-500 text-white rounded-full absolute top-0 right-0 shadow-sm" type="button">
                <X className="h-4 w-4"/>
            </button>

        </div>
        )
    }
    return (
        <UploadDropzone
        endpoint={endpoint}
        onClientUploadComplete={(res)=>{
            onChange(res?.[0].url);
        }}
        onUploadError={(error:Error)=>{
            console.log(error);
        }}/>
    )
}