import { useClient } from "@/hooks/useClient";
import { User } from "stream-chat";
import { 
    Chat, 
    Channel,
    ChannelList,
    ChannelHeader,
    MessageList,
    MessageInput,
    Thread,
    Window,
 } from "stream-chat-react";
 import 'stream-chat-react/css/v2/index.css';
import ServerList from "./ServerList/ServerList";
import CustomChannelList from "./ChannelList/CustomChannelList";
import CustomDateSeparator from "./MessageList/CustomDateSeparator/CustomDateSeparator";

 export default function MyChat({ 
    apiKey, 
    user, 
    token,
  }: { 
    apiKey: string;
    user: User;
    token: string;
 }) {
    const chatClient = useClient({
        apiKey, 
        user, 
        tokenOrProvider: token,
    });
    if (!chatClient) {
        return <div>Error, please try again later.</div>;
    }
    return (
        <Chat client={chatClient} theme='str-chat__theme--light'>
            <section className="flex h-screen w-screen layout">
            <ServerList/>
            <ChannelList List={CustomChannelList} />
            <Channel
                DateSeparator={CustomDateSeparator}
            >
                <Window>
                    <MessageList />
                    <MessageInput />
                </Window>
            </Channel>
            </section>
        </Chat>
    );
 }