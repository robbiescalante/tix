import { UseFormRegisterReturn } from 'react-hook-form';

export type Post = {
    id: string;
    videoUrl: string;
    description: string;
    tag: string;
    views: string;
}

export interface CropperDimensions {
    height?: number | null;
    width?: number | null;
    left?: number | null;
    top?: number | null;
}

export interface ShowErrorObject {
    type: string;
    message: string;
}


export interface PostMainCompTypes {
    post: Post
}

export interface PostLikedCompTypes {
    post: Post;
    id: string;
}

export type Like = {
    id: string;
    user_id: string;
    post_id: string;
}

export interface ProfilePageTypes {
    params: {id: string; };
}

export interface PostMainLikesCompTypes {
    post: Post;
    toggleMute: () => void;
    isMuted: boolean; 
}

export interface TextInputCompTypes {
    string: UseFormRegisterReturn<string>;
    inputType: string;
    placeholder: string;
    error?: string; // Puedes asignar un valor por defecto
}

export interface PostPageTypes {
    data: string;
}
