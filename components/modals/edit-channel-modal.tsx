"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios"
import {
  Dialog,
  DialogContent,
 
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import qs from "query-string";

import { useParams, useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import { Select,SelectContent,SelectItem,SelectTrigger,SelectValue } from "../ui/select";
import { ChannelType } from "@prisma/client";
import { useEffect } from "react";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Server name is required",
  }).refine(name=>name!=="general",{message:"Channel name cannot be general"}),
  type:z.nativeEnum(ChannelType),
  
});


export const EditChannelModal = () => {
  const {isOpen,onClose,type,data} =useModal();

  const router = useRouter();

  const {channel,server} = data;

  const isModalOpen=isOpen&&type==="editChannel";

 

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type:channel?.type||ChannelType.TEXT,
      
    },
  });

  useEffect(()=>{
    if(channel){
      form.setValue("name",channel.name);
      form.setValue("type",channel.type);
    }


    

  },[form,channel])

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
    const url = qs.stringifyUrl({
      url: `/api/channels/${channel?.id}`,
      query: {
        serverId:server?.id
      },
    })
      await axios.patch(url,values);
      form.reset();
      router.refresh();
      

      
    } catch (error) {
      console.log(error)
      
    }
  };

  const handleClose=()=>{
    form.reset();
    onClose();
  }

  return (
    <div>
      <Dialog open={isModalOpen} onOpenChange={handleClose}>
        <DialogContent className="bg-white text-black p-0 overflow-hidden">
          <DialogHeader className="pt-8 px-6">
            <DialogTitle className="font-bold text-2xl text-center text-zinc">
              Edit Channel
            </DialogTitle>
            
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="p-6 space-y-8"
            >
              <div className="space-y-8 px-6">
                
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-zinc-500 font-bold uppercase text-xs dark:text-secondary/70">
                        Channel Name
                      </FormLabel>
                      <FormControl>
                        <input
                          disabled={isLoading}
                          type="text"
                          placeholder="Enter server name"
                          className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0 p-2 "
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField control={form.control} name="type" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-500 font-bold uppercase text-xs dark:text-secondary/70">Channel Type</FormLabel>
                    <Select disabled={isLoading} onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0 p-2 capitalize outline-none">
                        <SelectValue placeholder="Select Channel Type"/>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(ChannelType).map((type) => (
                          <SelectItem key={type} value={type}>
                            {type.toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage/>
                  </FormItem>
                  
                  
                )}
            ></FormField>

              </div>

              <DialogFooter className="bg-gray-100 px-6 py-4">
                <Button variant="primary" disabled={isLoading}>
                  Create
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};


