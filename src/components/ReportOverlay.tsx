import { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { BiLoaderCircle } from "react-icons/bi";
import TextInput from "./TextInput";
import { ShowErrorObject } from "@/app/types";
import { useForm } from 'react-hook-form';
import { sendEmail } from '@/components/utils/sent-email2';

export type FormData = {
    id: string;
    name: string;
    email: string;
    author: string;
    reason: string;
    message: string;
};

export default function ReportFormOverlay({ id, onClose }: { id: string; onClose: () => void }) {

    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, handleSubmit } = useForm<FormData>();

    function onSubmit(data: FormData) {
        setIsSubmitting(true);

        sendEmail(data, setIsSubmitting)
            .then(() => {
                onClose();
            })
            .catch((error) => {
                // Handle error if needed
            });
    }

    const [name, setName] = useState<string>("");
    const [reason, setReason] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [isAuthor, setIsAuthor] = useState<boolean>(false);
    const [email, setEmail] = useState<string>("");
    const [error, setError] = useState<ShowErrorObject | null>(null)

    return (
        <>
            <div
                id="ReportFormOverlay"
                className="fixed flex justify-center pt-24 md:pt-[105px] z-50 top-0 left-0 w-full h-full bg-black bg-opacity-50 overflow-auto"
                onClick={onClose}
            >
                <div
                    className="relative bg-neutral-100 w-full max-w-[700px] sm:h-[700px] h-[800px] mx-3 p-4 rounded-lg mb-10"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="absolute flex items-center justify-between w-full p-5 left-0 top-0 bg-black">
                        <h1 className="text-[22px] text-white font-medium">Report Form</h1>
                        <button disabled={isSubmitting} className="text-white" onClick={onClose}>
                            <AiOutlineClose size="25" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="h-[calc(700px-200px)] mt-16">

                            {/* Name Field */}
                            <div
                                id="UserNameSection"
                                className="flex flex-col border-b border-b-neutral-300 sm:h-[80px]  px-1.5 py-2 pt-4  w-full"
                            >
                                <h3 className="font-semibold text-[15px] sm:mb-0 mb-1 text-neutral-800 sm:w-[160px] sm:text-left text-center">
                                    Name
                                </h3>
                                <div className="flex items-center justify-center sm:-mt-6">
                                    <div className="sm:w-[60%] w-full max-w-md">
                                        <input
                                            type='text'
                                            placeholder='Name'
                                            className="block w-full bg-white text-gray-800 border border-gray-200 rounded-md py-2.5 mb-1 px-3 outline-none focus:border-purple-500 focus:shadow-md"
                                            {...register('name', { required: true })}
                                            autoComplete="off"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Email Field */}
                            <div
                                id="UserNameSection"
                                className="flex flex-col border-b border-b-neutral-300 sm:h-[80px]  px-1.5 py-2 pt-4  w-full"
                            >
                                <h3 className="font-semibold text-[15px] sm:mb-0 mb-1 text-neutral-800 sm:w-[160px] sm:text-left text-center">
                                    Email
                                </h3>
                                <div className="flex items-center justify-center sm:-mt-6">
                                    <div className="sm:w-[60%] w-full max-w-md">
                                        <input
                                            type='email'
                                            placeholder='Email'
                                            className="block w-full bg-white text-gray-800 border border-gray-200 rounded-md py-2.5 mb-1 px-3 outline-none focus:border-purple-500 focus:shadow-md"
                                            {...register('email', { required: true })}
                                            autoComplete="off"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Author Field */}
                            <div
                                id="UserNameSection"
                                className="flex flex-col border-b border-b-neutral-300 sm:h-[50px]  px-1.5 py-2 mt-1.5  w-full"
                            >
                                <h3 className="font-semibold text-[15px] sm:mb-0 mb-1 text-neutral-800 sm:w-[160px] sm:text-left text-center">
                                    Author
                                </h3>

                                <div className="flex items-center justify-center sm:-mt-6">
                                    <div className="sm:w-[60%] w-full max-w-md">
                                        <label className="flex items-center justify-center sm:justify-normal">
                                            <input
                                                type="checkbox"
                                                checked={isAuthor}
                                                onChange={(e) => {
                                                    setIsAuthor(e.target.checked);
                                                    register('author', {
                                                        value: e.target.checked ? 'Is author' : 'Is not author', 
                                                        required: true,
                                                    });
                                                }}
                                                className="form-checkbox h-4 w-4 text-blue-500 outline-none focus:border-purple-500 focus:shadow-md"
                                            />
                                            <span className="ml-2 text-gray-700">Yes, I am the author</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Reason Field */}
                            <div
                                id="UserNameSection"
                                className="flex flex-col border-b border-b-neutral-300 sm:h-[80px]  px-1.5 py-2 mt-1.5  w-full"
                            >
                                <h3 className="font-semibold text-[15px] sm:mb-0 mb-1 text-neutral-800 sm:w-[160px] sm:text-left text-center">
                                    Reason
                                </h3>

                                <div className="flex items-center justify-center sm:-mt-6">
                                    <div className="sm:w-[60%] w-full max-w-md">
                                        <input
                                            type='text'
                                            placeholder='Reason'
                                            className="block w-full bg-white text-gray-800 border border-gray-200 rounded-md py-2.5 mb-1 px-3 outline-none focus:border-purple-500 focus:shadow-md"
                                            {...register('reason', { required: true })}
                                            autoComplete="off"
                                            maxLength={30}
                                            onChange={(e) => setReason(e.target.value)}
                                            value={reason}
                                        />
                                        <p className="text-[11px] text-gray-500">{reason ? reason.length : 0}/30</p>
                                    </div>
                                </div>
                            </div>

                            {/* Message Field */}
                            <div
                                id="UserNameSection"
                                className="flex flex-col sm:h-[118px]  px-1.5 py-2 mt-1.5  w-full"
                            >
                                <h3 className="font-semibold text-[15px] sm:mb-0 mb-1 text-neutral-800 sm:w-[160px] sm:text-left text-center">
                                    Message
                                </h3>

                                <div className="flex items-center justify-center sm:-mt-6">
                                    <div className="sm:w-[60%] w-full max-w-md">
                                        <textarea
                                            cols={30}
                                            rows={4}
                                            value={message}
                                            maxLength={80}
                                            placeholder="Your Message"
                                            className="resize-none w-full bg-white text-gray-800 border border-gray-300 rounded-md py-2.5 px-3 outline-none focus:border-purple-500 focus:shadow-md"
                                            {...register('message', { required: true })}
                                            onChange={(e) => setMessage(e.target.value)}
                                        ></textarea>
                                        <p className="text-[11px] text-gray-500">{message ? message.length : 0}/80</p>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div
                            id="ButtonSection"
                            className="absolute p-5 left-0 bottom-0 border-t border-t-gray-300 bg-black w-full"
                        >
                            <div className="flex items-center justify-end">
                                <button
                                    disabled={isSubmitting}
                                    type="button"
                                    onClick={onClose}
                                    className="flex items-center rounded-sm px-3 py-[6px]"
                                >
                                    <span className="px-2 font-medium text-[15px] text-white">Cancel</span>
                                </button>

                                <button
                                    disabled={isSubmitting}
                                    type="submit"
                                    className="flex items-center bg-white text-black rounded-md ml-3 px-3 py-[6px]"
                                >
                                    <span className="mx-4 font-bold text-[15px]">
                                        {isSubmitting ? (
                                            <BiLoaderCircle color="#000000" className="my-1 mx-2.5 animate-spin" />
                                        ) : (
                                            "Submit"
                                        )}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}