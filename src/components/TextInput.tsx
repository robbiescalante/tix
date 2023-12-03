import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import { TextInputCompTypes } from '@/app/types';

export default function TextInput({
    string,
    inputType,
    placeholder,
    error,
}: TextInputCompTypes): React.JSX.Element {
    return (
        <>
            <input
                placeholder={placeholder}
                className="block w-full bg-white text-gray-800 border border-gray-200 rounded-md py-2.5 mb-1 px-3 focus:outline-none"
                {...string}
                autoComplete="off"
                type={inputType}
            />

            <div className="text-red-500 text-[11px] font-semibold mb-1">
                {error !== undefined ? error : null}
            </div>
        </>
    );
}