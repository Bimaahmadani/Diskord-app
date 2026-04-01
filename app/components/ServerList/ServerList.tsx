import { DiscordServer } from "@/models/DiscordServer";
import {v4 as uuid} from 'uuid';
import Image from "next/image";

export default function ServerList() {
    const servers: DiscordServer[] = [
        {
            id: uuid(),
            name: 'Test Server 1',
            image: ''
        },
        {
            id: uuid(),
            name: 'Test Server 2',
            image: ''
        },
        {
            id: uuid(),
            name: 'Test Server 3',
            image: ''
        },

    ];
    return <div className="bg-blue-500">
        {servers.map(server => (
            <button 
            key={server.id} 
            onClick={() => console.log(`Clicked on server ${server.name}`)}>
             {server.image && checkIfurl(server.image) ? (
                <Image
                src={server.image}
                width={50}
                height={50}
                alt='Server Icon'
                />
             ) :(
                <span className="bg-gray-600 w-[50px] flex items-center justify-center text-sm rounded-full">
                    {server.name.charAt(0)}
                </span>
             )}
            </button>
            ))}
    </div>
}

function checkIfurl(path: string): Boolean {
    try {
        const _ = new URL(path);
        return true;
    } catch (_) {
        return false;
    }
}