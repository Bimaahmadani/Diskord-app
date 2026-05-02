import { JSX } from "react";
import { useMessageContext } from "stream-chat-react";
import Image from "next/image";

export default function CustomMessage(): JSX.Element {
    const {message} = useMessageContext();

    return (
        <div className="flex relative space-x-2 p-2 rounded-md transition-colors ease-in-out duration-200 hover:bg-gray-100">
            <Image
            className="rounded-full aspect-square object-cover w-10 h-10"
            width={40}
            height={40}
            src={message.user?.image || 'https://getstream.io/random_png/'}
            alt="User Avatar"
            />

            <div>
                <div className="space-x-2">
                    <span className="'font-semibold text-sm text-black">
                        {message.user?.name}
                    </span>
                </div>
            </div>
        </div>
    )
}