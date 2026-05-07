// CustomEmojiPicker.tsx

import { JSX, useState } from "react";
import data from '@emoji-mart/data';
import dynamic from 'next/dynamic';
import { Emoji } from "../../Icons"; // Sesuaikan path ini jika letak foldernya berbeda

// Import dinamis untuk mencegah error SSR
const Picker = dynamic(() => import('@emoji-mart/react'), { 
    ssr: false,
    loading: () => (
        <div className="w-64 h-64 flex items-center justify-center bg-white shadow-lg rounded-lg border text-sm text-gray-500">
            Loading emojis...
        </div>
    ) 
});

interface CustomEmojiPickerProps {
    onEmojiSelect: (emoji: string) => void;
}

export default function CustomEmojiPicker({ onEmojiSelect }: CustomEmojiPickerProps): JSX.Element {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (emoji: any) => {
        onEmojiSelect(emoji.native); // Langsung kirim karakter emojinya saja
    };

    return (
        <div className="relative flex items-center justify-center">
            {/* Tombol Trigger (Ikon Emoji bawaan Anda) */}
            <button 
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center outline-none"
            >
                <Emoji className="w-8 h-8 hover:text-gray-800" />
            </button>
            
            {/* Kotak Picker */}
            {isOpen && (
                <div className="absolute bottom-12 right-0 z-50 shadow-2xl rounded-lg">
                    <Picker 
                        data={data} 
                        onEmojiSelect={handleSelect} 
                        theme="light" 
                    />
                </div>
            )}
        </div>
    );
}