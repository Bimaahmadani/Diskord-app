import { JSX, useState } from "react";
import { useChatContext } from "stream-chat-react";
import { PlusCircle } from "../../Icons";

export default function MessageComposer(): JSX.Element {
    const [plusMenuOpen, setPlusMenuOpen] = useState(false);
    const {channel}= useChatContext();
    const [message, setMessage]= useState('');

    return(
        <div className="flex m-6 px-4 py-1 bg-composer-gray items-center justify-center space-x-4 rounded-md text-gray-600 relative">
            <button onClick={()=> setPlusMenuOpen((menuOpen)=>!menuOpen)}>
                <PlusCircle className="w-8 h-8 hover:text-gray-800"/>
            </button>
            {plusMenuOpen &&(
                
            )}
        </div>
    )


}