import { JSX, Dispatch, SetStateAction } from "react";
import { Thread, Emoji, ArrowUturnLeft } from "../../Icons";

export default function MessageOptions({
    showEmojiReactions
} :{
    showEmojiReactions:Dispatch<SetStateAction<boolean>>,
}
): JSX.Element {
    return (
        <div className="absolute flex items-center -top-4 right-2 rounded-md bg-gray-50 border-2 hover:border-gray-200">
            <button className="p-1 transition-colors duration-200 ease-in-out hover:bg-gray-200"
               onClick={()=> showEmojiReactions((currentValue)=>!currentValue)}>
               <Emoji className="w-6 h-6"/>
            </button> 
            <button className="p-1 transition-colors duration-200 ease-in-out hover:bg-gray-200">
               <ArrowUturnLeft className="w-6 h-6"/>
            </button> 
            <button className="p-1 transition-colors duration-200 ease-in-out hover:bg-gray-200">
               <Thread className="w-6 h-6"/>
            </button> 
        </div>
    )
}