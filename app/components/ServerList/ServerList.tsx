import { DiscordServer } from "@/models/DiscordServer";
import {v4 as uuid} from 'uuid';
import Image from "next/image";
import { JSX, useCallback, useEffect, useState } from "react";
import Link from "next/dist/client/link";
import CreateServerForm from "./CreateServerForm";
import { useChatContext } from "stream-chat-react";
import type { Channel } from "stream-chat";
import { useDiscordContext } from "@/app/contexts/DiscordContext";


export default function ServerList(): JSX.Element {
    const {client}= useChatContext();
    const{server: activeServer, changeServer} = useDiscordContext();

    // const [activeServer, setActiveServer] = useState<DiscordServer| undefined>();
    const [serverList, setServerList] = useState<DiscordServer[]>([]);
    const [openModal, setOpenModal] = useState(false);

    // const servers: DiscordServer[] = [
    //     {
    //         id: '1',
    //         name: 'Test Server 1',
    //         image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=1120&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    //     },
    //     {
    //         id: '2',
    //         name: 'Test Server 2',
    //         image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTN8fHRlY2hub2xvZ3l8ZW58MHx8MHx8fDA%3D'
    //     },
    //     {
    //         id: '3',
    //         name: 'Test Server 3',
    //         image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHRlY2hub2xvZ3l8ZW58MHx8MHx8fDA%3D'
    //     },

    // ];

    const loadServerList = useCallback( async (): Promise<void> => {
        const channels = await client.queryChannels({
            type: 'messaging', 
            members: {$in: [client.userID as string]},
        });
        const serverSet: Set<DiscordServer> = new Set(
            channels
                .map((channel: Channel) => {


                return {
                        id: channel.data?.data?.serverId,
                        name: (channel.data?.data?.server as string) ?? 'Unknown',
                        image: channel.data?.data?.image,      
                };
            })
            .filter((server: DiscordServer) => server.name !== 'Unknown')
            .filter((server: DiscordServer, index, self) => 
                index === 
                self.findIndex((serverObject) => serverObject.name === server.name)
            )
        );
        const serverArray = Array.from(serverSet.values());
        setServerList(serverArray);
        if(serverArray.length > 0){
            changeServer(serverArray[0], client);
        }

    }, [client, changeServer]);

    useEffect(() => {
        loadServerList();
    }, [loadServerList]);
    return (
    <div className="bg-dark-gray h-full flex flex-col items-center py-3 gap-y-3">
        {serverList.map(server => (
            <button 
            key={server.id}
            className={`sidebar-icon ${server.id === activeServer?.id ? 'selected-icon' : ''}`} 
            onClick={() => changeServer(server, client)}>
             {server.image && checkIfurl(server.image) ? (
                <Image
                src={server.image}
                width={50}
                height={50}
                alt='Server Icon'
                className="rounded-icon"
                />
             ) :(
                <span className="rounded-icon bg-gray-600 w-12.5 flex items-center justify-center text-sm">
                    {server.name.charAt(0)}
                </span>
             )}
            </button>
            ))}
            <button
                onClick={() => setOpenModal(true)}
                className="flex items-center justify-center rounded-icon bg-white p-2 text-2xl font-light h-12 w-12
                text-green-500 hover:bg-green-500 hover:text-white hover:rounded-xl transition-all duration-200"
            >
                +
            </button>

            {/* MODAL */}
            <CreateServerForm open={openModal} setOpen={setOpenModal} />
    </div>
    );

    // function checkIfurl(path: string): Boolean {
    //     try {
    //         const _ = new URL(path);
    //         return true;
    //     } catch (_) {
    //         return false;
    //     }
    // }

    function checkIfurl(path: string): boolean {
    return !!path;
}
}

