import { useDiscordContext } from "@/app/contexts/DiscordContext";
import { Phone } from "../Icons";
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
    ReactionsButton,
    useCall
    
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { FastAverageColor } from 'fast-average-color';
import { JSX, useEffect } from "react";

export default function CallLayout(): JSX.Element{
    const { setCall } = useDiscordContext();
    const { useCallCallingState, useParticipantCount, useParticipants } = useCallStateHooks();
    const participantCount = useParticipantCount();
    const participants = useParticipants();
    const callingState = useCallCallingState();
    const call = useCall();

    // Efek untuk mengekstrak warna dominan dari Foto Profil atau Nama
    useEffect(() => {
        const fac = new FastAverageColor();

        // Fungsi kecil untuk mengubah String (Nama User) menjadi Kode Warna Hex (seperti Discord)
        const stringToColor = (str: string) => {
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                hash = str.charCodeAt(i) + ((hash << 5) - hash);
            }
            let color = '#';
            for (let i = 0; i < 3; i++) {
                const value = (hash >> (i * 8)) & 0xFF;
                color += ('00' + value.toString(16)).substr(-2);
            }
            return color;
        };

        const applyDynamicColors = async () => {
            const participantBoxes = document.querySelectorAll('.str-video__participant-view');

            for (let i = 0; i < participantBoxes.length; i++) {
                const box = participantBoxes[i] as HTMLElement;
                const img = box.querySelector('img') as HTMLImageElement;
                
                // Cari elemen teks nama pengguna untuk dijadikan fallback
                const nameElement = box.querySelector('.str-video__participant-details') as HTMLElement;
                const userName = nameElement ? nameElement.innerText : 'Unknown';

                // 1. Jika ada gambar profil asli
                if (img && img.src && !img.src.includes('data:image/svg')) {
                    try {
                        const color = await fac.getColorAsync(img.src, { algorithm: 'dominant' });
                        box.style.backgroundImage = `linear-gradient(to bottom, ${color.rgba}, #111214)`;
                    } catch (error) {
                        console.log("Gagal ekstrak gambar, menggunakan warna fallback nama...");
                        const fallbackColor = stringToColor(userName);
                        box.style.backgroundImage = `linear-gradient(to bottom, ${fallbackColor}80, #111214)`; // 80 untuk transparansi
                    }
                } 
                // 2. Jika tidak ada gambar (Hanya inisial seperti "N")
                else {
                    const fallbackColor = stringToColor(userName);
                    // Gunakan warna hex yang dihasilkan dari nama pengguna
                    box.style.backgroundImage = `linear-gradient(to bottom, ${fallbackColor}80, #111214)`;
                }
            }
        };

        // Tunggu 800ms agar DOM Stream dan Avatar selesai dimuat dengan sempurna
        const timeoutId = setTimeout(applyDynamicColors, 800);
        return () => clearTimeout(timeoutId);
        
    }, [participants])

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
                
                <div className="absolute top-4 left-6 bg-black/50 px-3 py-1 rounded-md text-white text-sm font-semibold">
                    👥 {participantCount}
                </div>
            </div>


            <div className="mb-4 flex justify-center items-center gap-6">
                <div className="flex justify-center items-center py-2 px-4 space-x-2 bg-gray-700 border-2 border-gray-400 rounded-xl">
                    <ToggleAudioPublishingButton />
                    <ToggleVideoPublishingButton />
                </div>
                
                <div className="flex justify-center items-center py-2 px-4 space-x-2 bg-gray-700 border-2 border-gray-400 rounded-xl">
                    <ScreenShareButton />
                    <RecordCallButton/>
                    <ReactionsButton/>
                </div>
                {/* <div className="flex bg-[#dc433b] hover:bg-[#e96962] items-center justify-center px-4 py-2 rounded-xl">
                    <CancelCallButton onLeave={() => setCall(undefined)} />
                </div> */}
                {/* Tombol End Call Kustom */}
                <button 
                    onClick={async () => {
                        await call?.leave(); // Memberitahu server Stream bahwa user keluar
                        setCall(undefined);  // Mengembalikan UI Anda ke mode chat biasa
                    }}
                    className="bg-[#dc433b] hover:bg-[#e96962] text-white flex items-center justify-center px-5 py-4 rounded-xl transition-all"
                >
                    <Phone/>
                </button>
                
            </div>
        </StreamTheme>
    )
}