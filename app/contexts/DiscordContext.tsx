'use client';
import { DiscordServer } from "@/models/DiscordServer";
import { MemberRequest, StreamVideoClient } from "@stream-io/video-react-sdk";
import { channel } from "diagnostics_channel";
import { createContext, use, useCallback, useContext, useState } from "react";
import { Channel, StreamChat, ChannelFilters } from "stream-chat";
import { DefaultChannelData } from "stream-chat-react";
import { v4 as uuid } from "uuid";

type DiscordState= {
    server?: DiscordServer;
    callId: string | undefined;
    channelsByCategories: Map<string, Array<Channel>>
    changeServer:(server: DiscordServer | undefined, client: StreamChat) => void;
    createServer:(
        client: StreamChat,
        videoClient: StreamVideoClient,
        name: string,
        imageUrl: string,
        userIds: string[]
    ) => void;
    createChannel:(
        client: StreamChat,
        name: string,
        category: string,
        userIds: string[]
    ) => Promise<void>; // <--- Ubah ini menjadi Promise<void>

    createCall:(
        client: StreamVideoClient,
        server: DiscordServer,
        channelName: string,
        userids: string[]
    ) => Promise<void>; //
    setCall: (callId:string | undefined) => void;
};

const initialValue: DiscordState = {
    server: undefined,
    callId: undefined,
    channelsByCategories: new Map(),
    createServer: async() => {},
    changeServer: async() => {},
    createChannel: async () => {},
    createCall: async() => {},
    setCall: ()=>{},
};

declare module "stream-chat" {
  // TypeScript akan menggabungkan CustomChannelData ini dengan internal SDK
  interface CustomChannelData extends DefaultChannelData  {
    name?: any;
    image?: any;
    serverId?: any;
    server?: any;
    category?: any;
    data?:any;
  }
}

const DiscordContext = createContext<DiscordState>(initialValue);

export const DiscordContextProvider: any = ({
    children,
}: { 
    children: React.ReactNode;
 }) => {
    const [myState, setMyState] = useState<DiscordState>(initialValue);

    const changeServer = useCallback(
        async (server: DiscordServer | undefined, client: StreamChat) => {
            let filters: ChannelFilters ={
                type: 'messaging',
                members: {$in: [client.userID as string]},
            };
            if (!server){
                filters.member_count = 2;
            }

            const channels = await client.queryChannels(filters);
            const channelsByCategories = new Map<
                string,
                Array<Channel>
            >();

            if(server){
                const categories = new Set(
                    channels
                    .filter((channel)=>{
                        return channel.data?.data?.server === server.name
                    })
                    .map((channel)=>{
                        return channel.data?.data?.category;
                    })
                );

                for (const category of Array.from(categories)){
                    channelsByCategories.set(
                        category,
                        channels.filter((channel)=>{
                            return(
                                channel.data?.data?.server === server.name &&
                                channel.data?.data?.category === category
                            );
                        })
                    )
                }
            } else{
                channelsByCategories.set('Direct Messages', channels);
            }
            setMyState((myState)=>{
                return {
                    ...myState,
                    server: server,
                    channelsByCategories
                };
            });
        },
        [setMyState]
    );

    const createCall = useCallback (
        async (
            client: StreamVideoClient,
            server: DiscordServer,
            channelName: string,
            userIds: string[]
        )=>{
            const callId= uuid();
            const audioCall = client.call('default', callId);
            const audioChannelMembers: MemberRequest[] = userIds.map((userId)=>{
                return{
                    user_id: userId,
                };
            });
            try{
                const createAudioCall = await audioCall.create({
                    data: {
                        custom:{
                            serverId: server?.id,
                            serverName: server?.name,
                            callName: channelName,
                        },
                        members: audioChannelMembers,
                    },    
                });
                console.log(
                    `[DiscordContext - createCall] Call created with ID: ${createAudioCall.call.id}`,
                )
            } catch (err){
                console.log(err)
            }
        },  
        []
    )

    const createServer = useCallback(
        async (
            client: StreamChat,
            videoClient: StreamVideoClient,
            name: string,
            imageUrl: string,
            userIds: string[]
        ) =>{
            const serverId = uuid();
            const messagingChannel = client.channel("messaging", uuid(), {
                name: "Welcome",
                members: userIds,
                data: {
                    image: imageUrl,
                    serverId: serverId,
                    server: name,
                    category:'Text Channels',
                }
            });

            try {
                const response = await messagingChannel.create();
                console.log("[DiscordContext - createServer] Response:", response);
                const server: DiscordServer = {
                    id: serverId,
                    name: name,
                    image: imageUrl,
                };
              
                    await createCall(
                        videoClient,
                        server,
                        'General Voice Channel',
                        userIds
                    )
                
            } catch (err) {
                console.error(err);
            }
        },
        [createCall]
    );

    const createChannel = useCallback(
        async (
            client: StreamChat,
            name: string,
            category: string,
            userIds: string[]
        ) => {
            if(client.userID) {
                const channel = client.channel('messaging', uuid(), {
                    name: name,
                    members: userIds,
                    data: {
                       image: myState.server?.image,
                       serverId: myState.server?.id,
                       server: myState.server?.name,
                       category: category,
                    }
                });
                try {
                // 2. Buat (atau 'watch') channel di server Stream
                await channel.create();
                
                // 3. KUNCI UTAMA: Panggil fungsi changeServer untuk REFRESH SIDEBAR!
                // Ini akan memaksa aplikasi menarik data terbaru yang sudah termasuk channel baru
                await changeServer(myState.server, client);
                
                console.log(`[DiscordContext] Channel ${name} berhasil dibuat!`);
            } catch (err) {
                console.error(err);
            }
            }
        },[myState.server, changeServer]
    );

    const setCall = useCallback(
        (callId: string | undefined) => {
            setMyState((myState)=>{
                return{ ...myState, callId};
            });
        },
        [setMyState]
    )

    const store: DiscordState= {
        server: myState.server,
        callId: myState.callId,
        channelsByCategories: myState.channelsByCategories,
        changeServer: changeServer,
        createServer: createServer,
        createChannel: createChannel,
        createCall: createCall,
        setCall: setCall,
    };

    return (
        <DiscordContext.Provider value={store}>
            {children}
        </DiscordContext.Provider>
    );
 };

 export const useDiscordContext = () => useContext(DiscordContext);