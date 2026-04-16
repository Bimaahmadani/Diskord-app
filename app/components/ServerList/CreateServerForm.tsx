import { useSearchParams } from "next/dist/client/components/navigation";
import Link from "next/link"
import { use, useCallback, useEffect, useRef, useState } from "react"
import { JSX } from "react/jsx-dev-runtime"
import { CloseIcon, useChat, useChatContext } from "stream-chat-react"
import { UserObject } from "@/models/UserObject";
import UserRow from "../UserRow";

interface Props {
    open: boolean;
    setOpen: (val: boolean) => void;
}

type FormState = {
    serverName: string;
    serverImage: string;
    users: UserObject[]
};



export default function CreateServerForm({ open, setOpen }: Props): JSX.Element {
    //check if we are shown
    const params = useSearchParams();
    const showCreateServerForm = params.get('createServer');
    const dialogRef = useRef<HTMLDialogElement>(null);

    //Data
    const {client}= useChatContext();
    const initialState: FormState = {
        serverName: '',
        serverImage: '',
        users: [],
    };

    const [formData, setFormData] = useState<FormState>(initialState);
    const [user, setUser] = useState<UserObject []>([]);

    const loadUsers = useCallback(async () => {
        const response = await client.queryUsers({});
        const users: UserObject[] = response.users
            .filter((user) => user.role !== "admin")
            .map((user) => {
                return {
                    id: user.id,
                    name: user.name ?? user.id,
                    image: user.image as string,
                    online: user.online,
                    lastOnline: user.last_active
                }
            });
            if (users) setUser(users);
    }, [client]);

    useEffect(() => {
        if (showCreateServerForm==='true') {
            setOpen(true);
        }
    }, [showCreateServerForm]);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

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
        
        <form method="dialog" className="flex flex-col space-y-2 px-6" action="">
            
            {/* Server Name Form */}
            <label className="labelTitle" htmlFor="serverName">
                Server Name
            </label>
            <div className="flex items-center bg-gray-100 rounded">
                <span className="text-2xl p-2 text-gray-500">#</span>
                <input
                    type="text"
                    id="serverName"
                    name="serverName"
                    value={formData.serverName}
                    onChange={(e) => 
                        setFormData({ ...formData, serverName: e.target.value })}
                    required
                />
            </div>

            {/* Image form */}
            <label className="labelTitle" htmlFor="serverImage">
                Image URL
            </label>
            <div className="flex items-center bg-gray-100 rounded">
                <span className="text-2xl p-2 text-gray-500">#</span>
                <input
                    type="text"
                    id="serverImage"
                    name="serverImage"
                    value={formData.serverImage}
                    onChange={(e) => 
                        setFormData({ ...formData, serverImage: e.target.value })}
                    required
                />
            </div>

            <div className="max-h-64 overflow-y-scroll">
                {user.map((user) => (
                    <UserRow key={user.id} user={user} userChanged={userChanged}/>
                ))}
            </div>
        </form>
    </dialog>
);

    function userChanged(user: UserObject, checked: boolean) {
        if (checked) {
            setFormData({
                ...formData,
                users: [...formData.users, user]
            });
            } else {
                setFormData({
                    ...formData,
                    users: formData.users.filter((thisUser) => thisUser.id !== user.id)
                });
            }
    }
}
    