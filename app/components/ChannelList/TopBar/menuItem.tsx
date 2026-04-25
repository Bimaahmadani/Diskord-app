import { 
    Bell, 
    Boost,
    FaceSmile,
    FolderPlus,
    Gear,
    LeaveServer,
    Pen,
    PersonAdd,
    PlusCircle,
    Shield,
    SpeakerMuted
 } from "../../Icons";

import { JSX } from "react";

export type ListRowElement = {
    name: string;
    icon: JSX.Element
    bottomBorder?: boolean;
    purple?:boolean;
    red?:boolean;
    reverseOrder?:boolean;
};

export const menuItems: ListRowElement[] =[
    
];