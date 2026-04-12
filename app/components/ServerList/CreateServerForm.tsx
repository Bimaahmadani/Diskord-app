import { useSearchParams } from "next/dist/client/components/navigation";
import Link from "next/link"
import { use, useEffect, useRef } from "react"
import { JSX } from "react/jsx-dev-runtime"
import { CloseIcon } from "stream-chat-react"

interface Props {
    open: boolean;
    setOpen: (val: boolean) => void;
}

export default function CreateServerForm({ open, setOpen }: Props): JSX.Element {
    const params = useSearchParams();
    const showCreateServerForm = params.get('createServer');
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
        dialog.showModal();
    }

    if (!open && dialog.open) {
        dialog.close();
    }

    const handleClose = () => setOpen(false);
    dialog.addEventListener("close", handleClose);

    return () => {
        dialog.removeEventListener("close", handleClose);
    };
}, [open]);


    return (
    <dialog 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 space-y-2 rounded-xl" 
        ref={dialogRef}
         onClick={(e) => {
                if (e.target === dialogRef.current) {
                    setOpen(false);
                }
            }}
        >
        <div className="w-full flex items-center justify-between py-8 px-6">
            <h2 className="text-3xl font-semibold text-gray-600">
                Create a Server
            </h2>
            <button onClick={() => setOpen(false)}>
                <CloseIcon />
            </button>
        </div>
    </dialog>
)
}
    