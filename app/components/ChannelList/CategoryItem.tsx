import { JSX, useState } from "react";
import { Channel } from "stream-chat";
import { ChevronDown, PlusIcon } from "../Icons";
import Link from "next/link";

type CategoryItemProps={
    category : string;
    channels: Channel[];
    serverName: string;
}

export default function CategoryItem({
    category,
    channels,
    serverName,
}:CategoryItemProps):JSX.Element{
    const [isOpen, setIsOpen] = useState(true);
    return(
        <div className="mb-5">
            <div className="felx items-center text-gray-500 p-2">
                <button
                    className="flex w-full items-center justify-start"
                    onClick={()=> setIsOpen((currentValue)=> !currentValue)}
                >
                    <div
                    className={`${isOpen ? '' : '-rotate-90'
                    } transition-all ease-in-out duration-200`}
                    >
                        <ChevronDown/>
                    </div>
                    <span className="inline-block uppercase text-sm font-bold px-2">
                        {category}
                    </span>
                </button>
                 <Link 
                        className="inline-block create-button"
                        href={`/?createChannel=true&serverName=${serverName}&category=${category}`}
                        ></Link>
                 <PlusIcon/>
            </div>
            {isOpen &&(
                <div>
                    {channels.map((channel)=>{
                        
                    })}
                </div>
            )}
        </div>
    )
}