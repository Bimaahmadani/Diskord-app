import { UserObject } from "@/models/UserObject";
import { useSearchParams,useRouter } from "next/navigation";
import { JSX, use, useCallback, useEffect, useRef, useState } from "react";
import {  useChatContext } from "stream-chat-react";
import { CloseIcon, Speaker } from "../../Icons";
import Link from "next/link";
import UserRow from "../../UserRow";
import { useDiscordContext } from "@/app/contexts/DiscordContext";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";


type FormState = {
    channelType: 'text' | 'voice';
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
    const videoClient = useStreamVideoClient();
    const { server, createCall, createChannel } = useDiscordContext();
    const initialState: FormState = {
        channelType: 'text',
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

    useEffect(()=>{
        const category = params.get('category');
        const isVoice = params.get('isVoice')
        setFormData({
            channelType: isVoice ? 'voice' : 'text',
            channelName: '',
            category: category ?? '',
            users: [],
        })
    }, [setFormData, params])

    useEffect(() => {
        if(showCreateChannelForm && dialogRef.current){
            dialogRef.current.showModal();
        } else{
            dialogRef.current?.close();
        }
    }, [showCreateChannelForm]);

    return (
       <dialog ref={dialogRef} 
    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-transparent p-0 focus:outline-none">
    
    {/* INNER WRAPPER: Di sinilah kita mengontrol tinggi total dan rounded-xl */}
    <div className="flex flex-col w-full bg-white rounded-xl overflow-hidden max-h-[90vh] shadow-2xl">
        
        {/* 1. HEADER (Ditahan dengan shrink-0) */}
        <div className="w-full flex items-center justify-between py-6 px-6 shrink-0 bg-white z-10">
            <h2 className="text-2xl uppercase font-bold text-gray-600">Create Channel</h2>
            <Link href='/'>
                <CloseIcon className='w-8 h-8 text-gray-400 cursor-pointer'/>
            </Link>
        </div>

        {/* 2. FORM BODY (Bisa di-scroll dengan flex-1 dan overflow-y-auto) */}
        <form method="dialog" className="flex-1 flex flex-col space-y-4 pl-6 pr-4 py-2 overflow-y-auto custom-scrollbar">
            
            <div className="space-y-4">
                <h3 className="labelTitle">Channel Type</h3>
                <div className="w-full flex space-x-4 items-center bg-gray-100 px-4 py-2 rounded-md">
                    <label 
                        htmlFor="text"
                        className="flex flex-1 items-center space-x-6"
                    >
                        <span className="text-4xl text-gray-400">#</span>
                        <div>
                            <p className="text-lg text-gray-700 font-semibold">Text</p>
                            <p className="text-gray-500 text-sm">
                                Send messages, images, GIFs, emoji, opinions, and puns
                            </p>
                        </div>
                    </label>
                    <input 
                        type="radio" 
                        name="channelType"
                        id="text"
                        value="text"
                        checked={formData.channelType === 'text'}
                        onChange={() => setFormData({ ...formData, channelType: 'text'})}
                    />
                </div>
                <div className="w-full flex space-x-4 items-center bg-gray-100 px-4 py-2 rounded-md">
                    <label 
                        htmlFor="voice"
                        className="flex flex-1 items-center space-x-6"
                    >
                        <Speaker className="w-7 h-7 text-gray-400"/>
                        <div>
                            <p className="text-lg text-gray-700 font-semibold">Voice</p>
                            <p className="text-gray-500 text-sm">
                                Hang out together with voice, video, and screen share
                            </p>
                        </div>
                    </label>
                    <input 
                        type="radio" 
                        name="channelType"
                        id="voice"
                        value="voice"
                        checked={formData.channelType === 'voice'}
                        onChange={() => setFormData({ ...formData, channelType: 'voice'})}
                    />
                </div>
            </div>

            <label className="labelTitle mt-4" htmlFor="channelName">Channel Name</label>
            <div className="flex items-center bg-gray-100 rounded-md">
                <span className="text-2xl p-2 px-3 text-gray-500">#</span>
                <input 
                    type="text"
                    id="channelName"
                    name="channelName" 
                    value={formData.channelName}
                    onChange={(e)=>
                        setFormData({ ...formData, channelName: e.target.value })
                    }
                    className="w-full bg-transparent outline-none py-2 pr-2"
                />
            </div>

            <label className="labelTitle flex items-center justify-between mt-4" 
                htmlFor="category">Category</label>
            <div className="flex items-center bg-gray-100 rounded-md">
                <span className="text-2xl p-2 px-3 text-gray-500">#</span>
                <input 
                    type="text"
                    id="category"
                    name="category" 
                    value={formData.category}
                    onChange={(e)=>
                        setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full bg-transparent outline-none py-2 pr-2"
                />
            </div>

            <h2 className="mb-2 labelTitle mt-4">Add Users</h2>
            {/* Hapus tinggi maksimal manual di sini, biarkan form utama yang menangani scroll */}
            <div className="pb-4"> 
                {user.map((u)=>(
                    <UserRow user={u} key={u.id} userChanged={userChanged}/>
                ))}
            </div>
        </form>

        {/* 3. FOOTER (Ditahan dengan shrink-0, tidak butuh sticky lagi!) */}
        <div className="flex space-x-4 items-center justify-end p-4 bg-gray-200 shrink-0">
            <Link href='/' className="font-semibold py-2 px-4 text-sm text-gray-500 hover:underline">
                Cancel
            </Link>

            <button type="submit"
                disabled={buttonDisabled()}
                className={`bg-discord rounded py-2 px-4 text-white text-sm font-semibold transition-opacity ${
                    buttonDisabled() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
                }`}
                onClick={createClicked}
            >
                Create Channel
            </button>
        </div>

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
        const memberIds = formData.users.map((user) => user.id);
        
        // Pastikan current user otomatis masuk ke dalam member channel
        if (client.userID && !memberIds.includes(client.userID)) {
            memberIds.push(client.userID);
        }

        switch (formData.channelType){
            case 'text':
            createChannel(
                client,
                formData.channelName,
                formData.category,
                memberIds
            );
            case 'voice':
            if (videoClient && server){
                createCall(
                    videoClient,
                    server,
                    formData.channelName,
                    memberIds
                )
            }
    }
    
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