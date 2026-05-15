import { useSearchParams, useRouter } from "next/dist/client/components/navigation";
import Link from "next/link"
import { CloseIcon } from "../Icons";
import { useCallback, useEffect, useRef, useState } from "react"
import { JSX } from "react/jsx-dev-runtime"
import { useChat, useChatContext } from "stream-chat-react"
import { UserObject } from "@/models/UserObject";
import UserRow from "../UserRow";
import { useDiscordContext } from "@/app/contexts/DiscordContext";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";


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
    const videoClient = useStreamVideoClient();
    const { createServer } = useDiscordContext();
    const initialState: FormState = {
        serverName: '',
        serverImage: '',
        users: [],
    };


    
    const router = useRouter();

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
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-transparent p-0 focus:outline-none" 
        ref={dialogRef}
         onClick={(e) => {
                if (e.target === dialogRef.current) {
                    setOpen(false);
                }
            }}
        >

        <div className="flex flex-col w-full bg-white rounded-xl overflow-hidden max-h-[90vh] shadow-2xl">

        <div className="w-full flex items-center justify-between py-6 px-6 shrink-0 bg-white z-10">
            <h2 className="text-2xl uppercase font-bold text-gray-600">
                Create a Server
            </h2>
            <button onClick={() => setOpen(false)}>
                <CloseIcon />
            </button>
        </div>
        
        <form method="dialog" className="flex-1 flex flex-col space-y-4 pl-6 pr-4 py-2 overflow-y-auto custom-scrollbar" action="">
            
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
            <h2 className="mb-2 labelTitle">Add User</h2>
            <div className="max-h-64 overflow-y-auto">
                {user.map((user) => (
                    <UserRow key={user.id} user={user} userChanged={userChanged}/>
                ))}
            </div>
        </form>
        <div className="flex space-x-4 items-center justify-end p-4 bg-gray-200">
            <Link href='/' className="font-semibold text-sm text-gray-500">
                Cancel
            </Link>
            <button type="submit"
            disabled={buttonDisabled()}
            className={`bg-discord rounded py-2 px-4 text-white text-sm font-semibold ${
                buttonDisabled() ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={createClicked}>
                Create Server
            </button>
        </div>

        </div>
    </dialog>
);

    function buttonDisabled(): boolean {
        return(
            !formData.serverName ||
            !formData.serverImage ||
            formData.users.length <= 1
        )

    }

  function createClicked(){
    const memberIds = formData.users.map((user) => user.id);
    
    // Pastikan current user otomatis masuk ke dalam member channel
    if (client.userID && !memberIds.includes(client.userID)) {
        memberIds.push(client.userID);
    }

    if (!videoClient){
        console.log('[CreateServerForm] Video client is not available');
        return;
    }

    createServer(
        client,
        videoClient,
        formData.serverName,
        formData.serverImage,
        memberIds
    );
    
    setFormData(initialState);
    router.replace('/');
}

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
    