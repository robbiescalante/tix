import TextInput from "../TextInput";
import { useState } from "react";
import { BiLoaderCircle } from "react-icons/bi";
import * as z from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from 'react-hook-form';
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function Login() {
    const FormSchema = z.object({
        email: z.string().min(1, 'Email is required').email('Invalid email'),
        password: z.string().min(1, 'Password is required'),
    });

    const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();
    const [errorText, setErrorText] = useState<string | null>(null);

    const showError = (type: string) => {
        if (errors[type as keyof typeof errors]) {
            return errors[type as keyof typeof errors]?.message;
        }
        return '';
    };

    const login = async (data: z.infer<typeof FormSchema>) => {
        try {
            setLoading(true);
            setErrorText(null); // Reinicia el mensaje de error en cada intento de inicio de sesión

            const signInData = await signIn('credentials', {
                email: data.email,
                password: data.password,
                redirect: false,
            });

            if (signInData?.error) {
                setErrorText('Invalid email or password'); // Actualiza el mensaje de error en caso de error
            } else {
                window.location.reload();
            }
        } catch (error) {
            // Manejar cualquier error que ocurra durante el inicio de sesión
            console.error(error);
            setErrorText('Something went wrong. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div>
                <h1 className="text-center text-[28px] mb-12 font-bold text-black">Log in</h1>

                <form onSubmit={
                    handleSubmit(login)
                } className="px-6 pb-2">
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

                    {errorText && (
                        <p className="text-red-500 mb-4">{errorText}</p>
                    )}

                    <div className="px-6 pb-2 mt-14">
                        <button
                            disabled={loading}
                            type="submit"
                            className={`flex items-center justify-center w-full text-[17px] font-semibold text-white py-3 rounded-sm bg-black
                            `}
                        >
                            {loading ? <BiLoaderCircle className="animate-spin" color="#ffffff" size={25} /> : 'Log in'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}