import { Thread, FolderPlus, Apps } from "../../Icons";
import { ListRowElement } from "../../ChannelList/TopBar/menuItem";

export const plusItems: ListRowElement[] = [
    {
        name: 'Upload a File',
        icon: <FolderPlus/>,
        bottomBorder: true,
        reverseOrder: true,
    },
    {
        name: 'Create Thread',
        icon: <Thread/>,
        bottomBorder: false,
        reverseOrder: true,
    },
    {name: 'Use Apps', icon: <Apps/>, bottomBorder: true, reverseOrder: true},
]
