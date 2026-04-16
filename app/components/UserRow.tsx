import { UserObject } from "@/models/UserObject";
import Image from "next/image";
import { JSX } from "react/jsx-dev-runtime";
import { PersonIcon } from "./Icons";

export default function UserRow({
    user,
    userChanged
}: {
    user: UserObject
    userChanged: (user: UserObject, checked: boolean) => void
}): JSX.Element {
    return(
        <div className="flex items-center justify-start w-full my-2">
            <input
            id={user.id} 
            type="checkbox"
            name={user.id}
            className="w-4 h-4 mb-0"
            onChange={(event) =>{
                userChanged(user, event.target.checked)
            }} 
            ></input>
            <label className="w-full flex items-center space-x-6" htmlFor={user.id}>
                {user.image &&(
                  <Image
                    src={user.image}
                    width={40}
                    height={40}
                    alt={user.name}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                {!user.image && <PersonIcon />}
                <div className="flex flex-col min-w-0">
                    <span className="block text-gray-600">{user.name}</span>
                    {user.lastOnline && (
                        <span className="text-gray-400 text-sm">
                            Last online: {user.lastOnline.split("T")[0]}
                        </span>
                    )}
                </div>
            </label>
        </div>
    )
}