import { useDiscordContext } from "@/app/contexts/DiscordContext";
import { JSX } from "react";
import { ChannelListMessengerProps } from "stream-chat-react";
import ChannelListTopBar from "./TopBar/ChannelListTopBar";
import CategoryItem from "./CategoryItem";

export default function CustomChannelList(): JSX.Element {
    const {server, channelsByCategories} = useDiscordContext();

    return (
    <div className="w-72 bg-medium-gray h-full flex flex-col items-start">
        <ChannelListTopBar serverName={server?.name || 'Find or start a conversation'}/>

        <div className="w-full">
            {Array.from(channelsByCategories.keys()).map((category,index)=>(
                <CategoryItem
                key={`${category}-${index}`}
                category={category}
                serverName={server?.name || 'Find or start a conversation'}
                channels={channelsByCategories.get(category) || []}
                />
            ))}
        </div>

    </div>
    
);
}