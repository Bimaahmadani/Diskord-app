import { useSearchParams } from "next/dist/client/components/navigation";
import Link from "next/link"
import { use, useEffect, useRef } from "react"
import { JSX } from "react/jsx-dev-runtime"
import { CloseIcon } from "stream-chat-react"

export default function CreateServerForm(): JSX.Element {
    const params = useSearchParams();
    const showCreateServerForm = params.get('createServer');
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        if (showCreateServerForm && dialogRef.current) {
            dialogRef.current.showModal();
        } else {
            dialogRef.current?.close();
        }
    },[showCreateServerForm]);


    return (
    <dialog className="absolute z-10 space-y-2 rounded-xl" ref={dialogRef}>
        <div className="w-full flex items-center justify-between py-8 px-6">
            <h2 className="text-3xl font-semibold text-gray-600">
                Create a Server
            </h2>
            <Link href='/'>
                <CloseIcon />
            </Link>
        </div>
    </dialog>
)
}
    