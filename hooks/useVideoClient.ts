import { useClientOptions } from "./useClient"
import { StreamVideoClient } from "@stream-io/video-react-sdk"
import { useEffect, useState } from "react"

export const useVideoClient = ({
    apiKey,
    user,
    tokenOrProvider,
}: useClientOptions): StreamVideoClient | undefined => {
    const [videoClient, setVideoClient] = useState<StreamVideoClient>();

    useEffect(() => {
        const streamVideoClient = new StreamVideoClient({apiKey});
        let didUserConnectInterrupt = false;

        const videoConnectionPromise = streamVideoClient
            .connectUser(user, tokenOrProvider)
            .then(()=>{
                if (!didUserConnectInterrupt) {
                    setVideoClient(streamVideoClient);
                }
            });

            return ()=>{
                didUserConnectInterrupt = true;
                setVideoClient(undefined);
                videoConnectionPromise
                    .then(()=>streamVideoClient.disconnectUser())
                    .then(()=>{
                        console.log('Video connection disconnected');
                    });
            }

    }, [apiKey, user.id, tokenOrProvider]);

    return videoClient;
}