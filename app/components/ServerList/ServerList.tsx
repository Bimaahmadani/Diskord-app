import { DiscordServer } from "@/models/DiscordServer";
import {v4 as uuid} from 'uuid';

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
            <button key={server.id} onClick={() => console.log(`Clicked on server ${server.name}`)}>
                {server.name}
            </button>
            ))}
    </div>
}