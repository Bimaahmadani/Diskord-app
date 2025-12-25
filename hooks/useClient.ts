import {use, useEffect, useState} from 'react';
import { StreamChat, TokenOrProvider, User } from 'stream-chat';

export type useClientOptions = {
    apiKey: string;
    user: User;
    tokenOrProvider: TokenOrProvider;
};

export const useClient = ({
    apiKey, 
    user, 
    tokenOrProvider,
}: useClientOptions): StreamChat | undefined => {
    const [chatClient, setChatClient] = useState<StreamChat>();

    useEffect(() => {
        const client = new StreamChat(apiKey);
        //prevent application from setting stale client (user changed)

        let didUserConnectInterrupt = false;
        
        const connectionPromise = client
        .connectUser(user, tokenOrProvider)
        .then(() => {
            if (!didUserConnectInterrupt) {
                setChatClient(client);
            }
        });

        return () => {
            didUserConnectInterrupt = true;
            setChatClient(undefined);

            connectionPromise
            .then(() => client.disconnectUser())
            .then(() => {
                console.log('Stream Chat client disconnected');
            });
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [apiKey, user.id, tokenOrProvider]);

    return chatClient;
};