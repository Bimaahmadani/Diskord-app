import { UserObject } from "@/models/UserObject";
import { useSearchParams,useRouter } from "next/navigation";
import { JSX, use, useCallback, useEffect, useRef, useState } from "react";
import {  useChatContext } from "stream-chat-react";
import { CloseIcon } from "../../Icons";
import Link from "next/link";
import UserRow from "../../UserRow";


type FormState = {
    channelName: string;
    category: string;
    users: UserObject[];
}

export function CreateChannelForm():JSX.Element {
    const params = useSearchParams();
    const showCreateChannelForm = params.get('createChannel');
    const category = params.get('category')

    const dialogRef= useRef<HTMLDialogElement>(null);
    const router = useRouter();

    const {client}= useChatContext();
    const initialState: FormState = {
        channelName: '',
        category: category ?? '',
        users: [],
    }
    const [formData, setFormData] = useState<FormState>(initialState);
    const [user, setUser] = useState<UserObject[]>([]);

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
                };
            });
            if (users) setUser(users);
    }, [client]);

     useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    useEffect(() => {
        if(showCreateChannelForm && dialogRef.current){
            dialogRef.current.showModal();
        } else{
            dialogRef.current?.close();
        }
    }, [showCreateChannelForm]);

    return (
        <dialog ref={dialogRef} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 space-y-2 rounded-xl overflow-hidden">
            <div className="w-full flex items-center justify-between py-8 px-6">
                <h2 className="text-3xl font-semibold text-gray-600">Create Channel</h2>
                <Link href='/'>
                    <CloseIcon className='w-10 h-10 text-gray-400'/>
                </Link>
            </div>
            <form method="dialog" className="flex flex-col space-y-4 px-6">
                <label className="labelTitle" htmlFor="channelName">Channel Name</label>
                <div className="flex items-center bg-gray-100">
                    <span className="text-2xl p-2 text-gray-500">#</span>
                    <input 
                    type="text"
                    id="channelName"
                    name="channelName" 
                    value={formData.channelName}
                    onChange={(e)=>
                        setFormData({ ...formData, channelName: e.target.value })
                    }
                    />
                </div>

                     <label className="labelTitle flex items-center justify-between" 
                     htmlFor="category">Category</label>
                 <div className="flex items-center bg-gray-100">
                    <span className="text-2xl p-2 text-gray-500">#</span>
                    <input 
                    type="text"
                    id="category"
                    name="category" 
                    value={formData.category}
                    onChange={(e)=>
                        setFormData({ ...formData, category: e.target.value })
                    }
                    />
                </div>
                <h2 className="mb-2 labelTitle">Add Users</h2>
                <div className="max-h-64 overflow-y-scroll">
                    {user.map((user)=>(
                        <UserRow user={user} key={user.id} userChanged={userChanged}/>
                    ))}
                </div>
            </form>

            <div className="flex space-x-6 items-center justify-end p-6 bg-gray-200">
                <Link href={'/'} className="font-semibold text-gray-500">
                    Cancel
                </Link>

                <button type="submit"
                disabled={buttonDisabled()}
                className={`bg-discord rounded py-2 px-4 text-white font-bold uppercase ${
                    buttonDisabled() ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={createClicked}
                >
                    Create Channel
                </button>
            </div>
        </dialog>
    );
     function buttonDisabled(): boolean {
        return(
            !formData.channelName ||
            !formData.category ||
            formData.users.length <= 1
        )

    }

      function createClicked(){
        // const memberIds = formData.users.map((user) => user.id);
        
        // // Pastikan current user otomatis masuk ke dalam member channel
        // if (client.userID && !memberIds.includes(client.userID)) {
        //     memberIds.push(client.userID);
        // }

        // createServer(
        //     client,
        //     formData.serverName,
        //     formData.serverImage,
        //     memberIds
        // );
    
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