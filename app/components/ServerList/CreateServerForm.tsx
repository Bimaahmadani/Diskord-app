import Link from "next/link"

export default function CreateServerForm() {
    return (
    <dialog className="absolute z-10 space-y-2 rounded-xl">
        <div className="w-full flex items-center justify py-8 px-6">
            <h2 className="text-3xl font-semibold text-gray-600">
                Create a Server
            </h2>
            <Link href='/'></Link>
        </div>
    </dialog>
)
}
    