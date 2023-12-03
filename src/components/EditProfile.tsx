
import TextInput from './TextInput';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from "react";
import { ShowErrorObject } from "@/app/types";
import { BiLoaderCircle } from "react-icons/bi";
import { useRouter } from "next/navigation";
import * as z from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { AiOutlineClose } from "react-icons/ai";
import { User } from '@prisma/client';
import { toast } from 'react-toastify';

export default function EditProfileOverlay({ onClose, id }: { onClose: () => void; id: string }) {

    console.log("Id desde log", id);

    const FormSchema = z
        .object({
            username: z.string().max(100),
            current: z.string()
                .min(1, 'You need to provide your password for any changes'),
            password: z
                .string(),
                confirmPassword: z.string(),
        })
        .refine((data) => data.password === data.confirmPassword, {
            path: ['confirmPassword'],
            message: 'Passwords do not match',
        });
        

    const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            username: '',
            current: '',
            password: '',
        },
    });



    const [loading, setLoading] = useState<boolean>(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const router = useRouter();
    const [profile, setProfile] = useState<User>();

    const showError = (type: string) => {
        if (errors[type as keyof typeof errors]) {
            return errors[type as keyof typeof errors]?.message;
        }
        return '';
    };

    const fetchData = async () => {
        try {
            const res = await fetch(`/api/profile/${id}`, {
                cache: 'no-store',
            });

            if (!res.ok) {
                throw new Error('Failed to fetch data');
            }

            const data = await res.json();
            console.log('Fetched data:', data);
            setProfile(data);
        } catch (error) {
            console.error(error);
            router.push('/error');
        }
    };

    useEffect(() => {
        fetchData();
    }, []); 

    console.error(profile);

    const updateUser = async (data: z.infer<typeof FormSchema>) => {
        try {
            setLoading(true);
            const response = await fetch('/api/user', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    usernameActual: profile?.username,
                    usernameNuevo: data.username,
                    passwordActual: data.current,
                    nuevaPassword: data.password,
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Registration failed:', errorData.message);
                toast.error(errorData.message);
            } else {
                // console.log('Registration successful!', data);
                toast.success('Registration successful!');
                onClose();
            }
        } catch (error) {
            console.error('Registration failed', error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div
            id="EditProfileOverlay"
            className="fixed flex justify-center pt-24 md:pt-[105px] z-50 top-0 left-0 w-full h-full bg-black bg-opacity-50 overflow-auto"
            onClick={onClose}>
            <div
                className={`
                relative bg-neutral-100 w-full max-w-[700px] sm:h-[650px] h-[700px] mx-3 p-4 rounded-lg mb-10
                'h-[655px]' : 'h-[580px]'}`} onClick={(e) => e.stopPropagation()}>
                    <div className="absolute flex items-center justify-between w-full p-5 left-0 top-0 bg-black">
                        <h1 className="text-[22px] text-white font-medium">
                            Edit profile
                        </h1>
                            <button
                                disabled={isUpdating}
                                className="text-white"
                                onClick={onClose}>
                                    <AiOutlineClose size="25" />
                            </button>
                    </div>

            <form onSubmit={handleSubmit(updateUser)} className="px-6 pb-2 mt-20">
                    <div id="UserNameSection" className="flex flex-col border-b border-b-neutral-300 sm:h-[90px] px-1 py-2 mt-1.5  w-full">
                        <h3 className="font-semibold text-[15px] sm:mb-0 mb-1 text-neutral-800 sm:w-[160px] sm:text-left text-center">
                            Name
                        </h3>
                        <div className="flex items-center justify-center sm:-mt-6 sm:pl-28">
                            <div className="w-full">
                                <TextInput
                                    string={register("username")}
                                    placeholder="Username"
                                    inputType="text"
                                    error={showError('username')}
                                />
                                <p className={`relative text-[11px] text-gray-500 mt-1 `}>
                                    Usernames can only contain letters, numbers, underscores, and periods.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div id="UserNameSection" className="flex flex-col sm:h-[70px] px-1.5 py-2 mt-1.5  w-full">
                        <h3 className="font-semibold text-[15px] sm:mb-0 mb-1 text-neutral-800 sm:w-[160px] sm:text-left text-center">
                            Password
                        </h3>
                        <div className="flex items-center justify-center sm:-mt-6 sm:pl-28">
                            <div className="w-full">
                                <TextInput
                                    string={register('current')}
                                    placeholder="Current password"
                                    inputType="password"
                                    error={showError('current')}
                                />
                            </div>
                        </div>
                    </div>

                    <div id="UserNameSection" className="flex flex-col sm:h-[70px] px-1.5 py-2 mt-1.5  w-full">
                        <div className="flex items-center justify-center sm:pl-28">
                            <div className="w-full">
                                <TextInput
                                    string={register('password')}
                                    placeholder="New password"
                                    inputType="password"
                                    error={showError('password')}
                                />
                            </div>
                        </div>
                    </div>

                    <div id="UserNameSection" className="flex flex-col border-b border-b-neutral-300 sm:h-[80px] px-1.5 py-2 mt-1.5  w-full">
                        <div className="flex items-center justify-center sm:pl-28">
                            <div className="w-full">
                                <TextInput
                                    string={register('confirmPassword')}
                                    placeholder="Confirm Password"
                                    inputType="password"
                                    error={showError('confirmPassword')}
                                />
                            </div>
                        </div>
                    </div>

                    <div
                        id="ButtonSection"
                        className="absolute p-5 left-0 bottom-0 border-t border-t-gray-300 bg-black w-full"
                    >
                        <div id="UpdateInfoButtons" className="flex items-center justify-end">
                            <button
                                disabled={isUpdating}
                                onClick={onClose}
                                className="flex items-center rounded-sm px-3 py-[6px] "
                            >
                                <span className="px-2 font-medium text-[15px] text-white">Cancel</span>
                            </button>

                            <button
                                disabled={loading}
                                type="submit"
                                className={`flex items-center bg-white text-black rounded-md ml-3 px-3 py-[6px] `}
                            >
                                <span className="mx-4 font-bold text-[15px]">
                                    {loading ? <BiLoaderCircle className="animate-spin" color="#000000" size={25} /> : 'Save'}
                                </span>
                            </button>
                            </div>
                    </div>
            </form>
            </div>
        </div>
    );
}










// import { useEffect, useState } from "react";
// import { BsPencil } from "react-icons/bs";
// import { AiOutlineClose } from "react-icons/ai";
// import { useRouter } from "next/navigation";
// import { BiLoaderCircle } from "react-icons/bi";
// import axios from 'axios';
// import * as z from 'zod';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from "@hookform/resolvers/zod";
// import TextInput from "./TextInput";

// export default function EditProfileOverlay({ onClose, username }: { onClose: () => void; username: string }) {
//     const router = useRouter();

//     const [userName, setUserName] = useState<string>('');
//     const [userpassword, setUserPassword] = useState<string>('');
//     const [userPassword, setUserNewPassword] = useState<string>('');
//     const [confirm, setConfirm] = useState<string>('');

//     const [isUpdating, setIsUpdating] = useState(false);

//     const EditProfileSchema = z.object({
//         username: z.string().min(1, 'Username is required'),
//         usernameNuevo: z.string().optional(),
//         passwordActual: z.string().min(1, 'Current Password is required').optional(),
//         nuevaPassword: z.string().min(1, 'New Password is required').optional(),
//         confirmarNuevaPassword: z.string().min(1, 'Confirm New Password is required').optional(),
//     }).refine(data => data.passwordActual === undefined || data.nuevaPassword === undefined || data.nuevaPassword === data.confirmarNuevaPassword, {
//         path: ['confirmarNuevaPassword'],
//         message: 'New passwords do not match',
//     });

//     const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof EditProfileSchema>>({
//         resolver: zodResolver(EditProfileSchema),
//         defaultValues: {
//             username: '',
//             usernameNuevo: '',
//             passwordActual: '',
//             nuevaPassword: '',
//         },
//     });

//     const showError = (type: string) => {
//         if (errors[type as keyof typeof errors]) {
//             return errors[type as keyof typeof errors]?.message;
//         }
//         return '';
//     };

//     const handleSave = async () => {
//         try {
//             setIsUpdating(true);

//             const data = EditProfileSchema.parse({
//                 username: username,
//                 usernameNuevo: userName,
//                 passwordActual: userpassword,
//                 nuevaPassword: userPassword,
//                 confirmarNuevaPassword: confirm,
//             });

//             await axios.put(`/api/user/${username}`, {
//                 usernameActual: data.username,
//                 usernameNuevo: data.usernameNuevo,
//                 passwordActual: data.passwordActual,
//                 nuevaPassword: data.nuevaPassword,
//             });

//             setIsUpdating(false);
//             onClose();
//         } catch (error) {
//             console.error('Validation error during user update:', error);
//             setIsUpdating(false);
//         }
//     };


//     return (
//         <>
//             <div
//                 id="EditProfileOverlay"
//                 className="fixed flex justify-center pt-24 md:pt-[105px] z-50 top-0 left-0 w-full h-full bg-black bg-opacity-50 overflow-auto"
//                 onClick={onClose}
//             >
//                 <div
//                     className={`
//                         relative bg-neutral-100 w-full max-w-[700px] sm:h-[650px] h-[655px] mx-3 p-4 rounded-lg mb-10
//                         'h-[655px]' : 'h-[580px]'}
//                     `}
//                     onClick={(e) => e.stopPropagation()}
//                 >
//                     <div className="absolute flex items-center justify-between w-full p-5 left-0 top-0 bg-black">
//                         <h1 className="text-[22px] text-white font-medium">
//                             Edit profile
//                         </h1>
//                         <button
//                             disabled={isUpdating}
//                             className="text-white"
//                             onClick={onClose}
//                         >
//                             <AiOutlineClose size="25" />
//                         </button>
//                     </div>

//                     <div className={`h-[calc(500px-200px)] mt-20`}>
//                         <div>
//                             <div
//                                 id="UserNameSection"
//                                 className="flex flex-col border-b border-b-neutral-300 sm:h-[118px] px-1.5 py-2 mt-1.5  w-full"
//                             >
//                                 <h3 className="font-semibold text-[15px] sm:mb-0 mb-1 text-neutral-800 sm:w-[160px] sm:text-left text-center">
//                                     Name
//                                 </h3>

//                                 <div className="flex items-center justify-center sm:-mt-6">
//                                     <div className="sm:w-[60%] w-full max-w-md">
//                                         <TextInput
//                                             string={userName}
//                                             placeholder="Username"
//                                             onUpdate={setUserName}
//                                             inputType="text"
//                                             error={showError('userName')}
//                                         />
//                                         <p className={`relative text-[11px] text-gray-500 'mt-1' : 'mt-4'}`}>
//                                             Usernames can only contain letters, numbers, underscores, and periods.
//                                             Changing your username will also change your profile link.
//                                         </p>
//                                     </div>
//                                 </div>
//                             </div>

//                             <div
//                                 id="PasswordSection"
//                                 className="flex flex-col border-b border-b-neutral-300 px-1.5 py-2 mt-1.5  w-full"
//                             >
//                                 <h3 className="font-semibold text-[15px] sm:mb-0 mb-1 text-neutral-800 sm:w-[160px] sm:text-left text-center">
//                                     Password
//                                 </h3>

//                                 <div className="flex items-center justify-center sm:-mt-6">
//                                     <div className="sm:w-[60%] w-full max-w-md">
//                                         <TextInput
//                                             string={userpassword}
//                                             placeholder="Current Password"
//                                             onUpdate={setUserPassword}
//                                             inputType="text"
//                                             error={showError('password')}
//                                         />
//                                     </div>
//                                 </div>
//                             </div>

//                             <div
//                                 id="NewPasswordSection"
//                                 className="flex flex-col border-b border-b-neutral-300 px-1.5 py-2 mt-1.5  w-full"
//                             >
//                                 <h3 className="font-semibold text-[15px] sm:mb-0 mb-1 text-neutral-800 sm:w-[160px] sm:text-left text-center">
//                                     New Password
//                                 </h3>

//                                 <div className="flex items-center justify-center sm:-mt-6">
//                                     <div className="sm:w-[60%] w-full max-w-md">
//                                         <TextInput
//                                             string={userPassword}
//                                             placeholder="New Password"
//                                             onUpdate={setUserNewPassword}
//                                             inputType="text"
//                                             error={showError('newPassword')}
//                                         />
//                                     </div>
//                                 </div>
//                             </div>

//                             <div
//                                 id="ConfirmPasswordSection"
//                                 className="flex flex-col border-b border-b-neutral-300 px-1.5 py-2 mt-1.5  w-full"
//                             >
//                                 <h3 className="font-semibold text-[15px] sm:mb-0 mb-1 text-neutral-800 sm:w-[160px] sm:text-left text-center">
//                                     Confirm Password
//                                 </h3>

//                                 <div className="flex items-center justify-center sm:-mt-6">
//                                     <div className="sm:w-[60%] w-full max-w-md">
//                                         <TextInput
//                                             string={confirm}
//                                             placeholder="Confirm Password"
//                                             onUpdate={setConfirm}
//                                             inputType="text"
//                                             error={showError('confirmPassword')}
//                                         />
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     <div
//                         id="ButtonSection"
//                         className="absolute p-5 left-0 bottom-0 border-t border-t-gray-300 bg-black w-full"
//                     >
//                         <div id="UpdateInfoButtons" className="flex items-center justify-end">
//                             <button
//                                 disabled={isUpdating}
//                                 onClick={onClose}
//                                 className="flex items-center rounded-sm px-3 py-[6px] "
//                             >
//                                 <span className="px-2 font-medium text-[15px] text-white">Cancel</span>
//                             </button>

//                             <button
//                                 disabled={isUpdating}
//                                 onClick={handleSave}
//                                 className="flex items-center bg-white text-black rounded-md ml-3 px-3 py-[6px]"
//                             >
//                                 <span className="mx-4 font-bold text-[15px]">
//                                     {isUpdating ? <BiLoaderCircle color="#ffffff" className="my-1 mx-2.5 animate-spin" /> : "Save"}
//                                 </span>
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// }