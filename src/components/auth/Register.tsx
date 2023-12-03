
import TextInput from "../TextInput";
import { useForm } from 'react-hook-form';
import { useState } from "react";
import { ShowErrorObject } from "@/app/types";
import { BiLoaderCircle } from "react-icons/bi";
import { useRouter } from "next/navigation";
import * as z from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";

export default function Register() {
    const FormSchema = z
        .object({
            username: z.string().min(1, 'Username is required').max(100),
            email: z.string().min(1, 'Email is required').email('Invalid email'),
            password: z
                .string()
                .min(1, 'Password is required')
                .min(8, 'Password must have at least 8 characters'),
            confirmPassword: z.string().min(1, 'Password confirmation is required'),
        })
        .refine((data) => data.password === data.confirmPassword, {
            path: ['confirmPassword'],
            message: 'Passwords do not match',
        });

    const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    const showError = (type: string) => {
        if (errors[type as keyof typeof errors]) {
            return errors[type as keyof typeof errors]?.message;
        }
        return '';
    };

    const registerUser = async (data: z.infer<typeof FormSchema>) => {
        try {
            setLoading(true);
            const response = await fetch('/api/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: data.username,
                    email: data.email,
                    password: data.password
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                toast.error(errorData.message);
                console.error('Registration failed:', errorData.message);
            } else {
                console.log('Registration successful!', data);
                
                const signInData = await signIn('credentials', {
                    email: data.email,
                    password: data.password,
                });
            }
        } catch (error) {
            console.error('Registration failed', error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div>
            <h1 className="text-center text-[28px] mb-12 font-bold text-black">Register</h1>

            <form onSubmit={handleSubmit(registerUser)} className="px-6 pb-2">
                <TextInput
                    string={register('username')}
                    placeholder="Username"
                    inputType="text"
                    error={showError('username')}
                />

                <TextInput
                    string={register('email')}
                    placeholder="Email address"
                    inputType="email"
                    error={showError('email')}
                />

                <TextInput
                    string={register('password')}
                    placeholder="Password"
                    inputType="password"
                    error={showError('password')}
                />

                <TextInput
                    string={register('confirmPassword')}
                    placeholder="Confirm Password"
                    inputType="password"
                    error={showError('confirmPassword')}
                />

                <div className="px-6 pb-2 mt-14">
                    <button
                        disabled={loading}
                        type="submit"
                        className={`flex items-center justify-center w-full text-[17px] font-semibold text-white py-3 rounded-sm bg-[black]
                        `}
                    >
                        {loading ? <BiLoaderCircle className="animate-spin" color="#ffffff" size={25} /> : 'Register'}
                    </button>
                </div>
            </form>
        </div>
    );
}