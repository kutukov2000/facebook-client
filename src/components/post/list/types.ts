import type { IUser } from "../../../interfaces/account";
import type { IAction, IFeeling, ISubAction } from "../../feelings/types";

interface IImage {
    id: string;
    imagePath: string;
}

export interface IPost {
    id: string;
    content: string;
    images: IImage[];
    location: string;
    tags: string[];
    createdAt: string;
    isArchive: boolean;
    userId: string;
    user: IUser
    actionId: string;
    action: IAction;
    subActionId: string;
    subAction: ISubAction;
    feelingId: string;
    feeling: IFeeling;
}