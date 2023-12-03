'use client';

import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { sendEmail } from '@/components/utils/send-email';
import { toast } from "react-toastify";

export type FormData = {
    name: string;
    email: string;
    message: string;
};

const Contactt: FC = () => {
    const { register, handleSubmit } = useForm<FormData>();

    function onSubmit(data: FormData) {
        sendEmail(data);
        toast.success("Email sent successfully");
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            
            <div className='mb-5 w-[65vw] sm:w-[calc(50vw-5px)] lg:w-[calc(50vw-180px)]'>
                <label
                    htmlFor='name'
                    className='mb-3 block text-base font-medium text-black'
                >
                    Full Name
                </label>
                <input
                    type='text'
                    placeholder='Full Name'
                    className='w-full rounded-md border border-gray-300 bg-white py-3 px-6 text-base font-medium text-gray-700 outline-none focus:border-purple-500 focus:shadow-md'
                    {...register('name', { required: true })}
                />
            </div>
            <div className='mb-5'>
                <label
                    htmlFor='email'
                    className='mb-3 block text-base font-medium text-black'
                >
                    Email Address
                </label>
                <input
                    type='email'
                    placeholder='example@domain.com'
                    className='w-full rounded-md border border-gray-300 bg-white py-3 px-6 text-base font-medium text-gray-700 outline-none focus:border-purple-500 focus:shadow-md'
                    {...register('email', { required: true })}
                />
            </div>
            <div className='mb-5'>
                <label
                    htmlFor='message'
                    className='mb-3 block text-base font-medium text-black'
                >
                    Message
                </label>
                <textarea
                    rows={4}
                    placeholder='Type your message'
                    className='w-full resize-none rounded-md border border-gray-300 bg-white py-3 px-6 text-base font-medium text-gray-700 outline-none focus:border-purple-500 focus:shadow-md'
                    {...register('message', { required: true })}
                ></textarea>
            </div>
            <div>
                <button
                    className='flex items-center bg-black text-white rounded-md px-4 py-2'>
                    <span
                        className='whitespace-nowrap mx-4 font-bold text-l'>Submit</span>
                </button>
            </div>
        </form>
    );
};

export default Contactt;