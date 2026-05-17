import { useDiscordContext } from "@/app/contexts/DiscordContext";
import { 
    CallingState, 
    SpeakerLayout, 
    StreamTheme, 
    useCallStateHooks,
    ToggleAudioPublishingButton,
    ToggleVideoPublishingButton,
    ScreenShareButton,
    CancelCallButton,
    RecordCallButton,
    ReactionsButton
    
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { JSX } from "react";

export default function CallLayout(): JSX.Element{
    const { setCall } = useDiscordContext();
    const { useCallCallingState, useParticipantCount } = useCallStateHooks();
    const participantCount = useParticipantCount();
    const callingState = useCallCallingState();

    if(callingState !== CallingState.JOINED){
        return (
            <div className="flex h-full w-full items-center justify-center text-white animate-pulse">
                Loading...
            </div>
        );
    }

    return(
        <StreamTheme className="flex flex-col h-full w-full bg-gray-normal">
            {/* Area Video (Atas) */}
            <div className="flex-1 relative overflow-hidden items-center">
                <SpeakerLayout participantsBarPosition='bottom'/>
                
                {/* Overlay Indikator Partisipan (Opsional, agar mirip Discord) */}
                <div className="absolute top-4 left-4 bg-black/50 px-3 py-1 rounded-md text-white text-sm font-semibold">
                    👥 {participantCount}
                </div>
            </div>


            <div className="flex justify-center items-center gap-6">
                <div className="flex justify-center items-center py-2 px-4 space-x-2 bg-gray-700 border-2 border-gray-400 rounded-xl">
                    <ToggleAudioPublishingButton />
                    <ToggleVideoPublishingButton />
                </div>
                
                <div className="flex justify-center items-center py-2 px-4 space-x-2 bg-gray-700 border-2 border-gray-400 rounded-xl">
                    <ScreenShareButton />
                    <RecordCallButton/>
                    <ReactionsButton/>
                </div>
                <div className="flex bg-[#dc433b] hover:bg-[#e96962] items-center justify-center px-4 py-2 rounded-xl">
                    <CancelCallButton onLeave={() => setCall(undefined)} />
                </div>
                
            </div>
        </StreamTheme>
    )
}