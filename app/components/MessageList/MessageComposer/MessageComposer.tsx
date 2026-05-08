import { JSX, useState } from "react";
import { SendButton, useChatContext } from "stream-chat-react";
import { GIF, PlusCircle, Present, Send } from "../../Icons";
import { plusItems } from "./plusItem";
import ChannelListMenuRow from "../../ChannelList/TopBar/ChannelListMenuRow";
import CustomEmojiPicker from "./CustomEmojiPicker";

export default function MessageComposer(): JSX.Element {
    const [plusMenuOpen, setPlusMenuOpen] = useState(false);
    const {channel}= useChatContext();
    const [message, setMessage]= useState('');

    // Fungsi penangkap emoji dari CustomEmojiPicker
    const handleEmojiSelect = (emojiChar: string) => {
        setMessage((prevMessage) => prevMessage + emojiChar);
    };

    const handleSend = (event: React.BaseSyntheticEvent) => {
        event.preventDefault(); // Mencegah form refresh bawaan
        if (message.trim() !== '') {
            channel?.sendMessage({ text: message });
            setMessage('');
        }
    };

    return(
        <div className="flex m-6 px-4 py-1 bg-composer-gray items-center justify-center space-x-4 rounded-md text-gray-600 relative">
            <button onClick={()=> setPlusMenuOpen((menuOpen)=>!menuOpen)}>
                <PlusCircle className="w-8 h-8 hover:text-gray-800"/>
            </button>
            {plusMenuOpen &&(
                <div className="absolute p-2 z-10 -left-6 bottom-12">
                    <div className="bg-white p-2 shadow-lg rounded-md w-40 flex flex-col">
                        {plusItems.map((option)=>(
                            <button
                            key={option.name}
                            className=""
                            onClick={() => setPlusMenuOpen(false)}
                            >
                                <ChannelListMenuRow {...option}/>
                            </button>
                        ))}
                    </div>
                </div>
            )}
            <input 
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
                    if (e.key === 'Enter' && message.trim() !== '') {
                        channel?.sendMessage({ text: message });
                        setMessage('');
                    }
                }}
            placeholder={`Message #${channel?.data?.name || 'general'}`}
            className="border-transparent bg-transparent outline-none text-sm font-semibold m-0 text-gray-normal" 
            />
            <Present className="w-8 h-8 hover:text-gray-800"/>
            <GIF className="w-8 h-8 hover:text-gray-800"/>
            <CustomEmojiPicker onEmojiSelect={handleEmojiSelect} />
           <button
                onClick={handleSend}
                disabled={message.trim() === ''}
                className={`transition-all duration-200 ${
                    message.trim() === '' 
                    ? 'text-gray-400 cursor-not-allowed opacity-50' 
                    : 'text-gray-600 hover:text-gray-800 cursor-pointer'
                }`}
            >
                <Send />
            </button>
        </div>
    )


}