"use client"
import { AiOutlineClose } from "react-icons/ai";
import { useState } from "react";
import Register from "./auth/Register";
import Login from "./auth/Login";
import { toast } from "react-toastify";

type AuthOverlayProps = {
    onClose: () => void;
};

export default function AuthOverlay({ onClose }: AuthOverlayProps ) {
    let [isRegister, setIsRegister] = useState(true);

    const closeOverlay = () => {
        // console.log("Closing overlay");  // Agrega este mensaje de consola
        setIsRegister(true);
        onClose();
    };

    return (
        <>
            <div
                id="AuthOverlay"
                className="fixed flex items-center justify-center z-50 top-0 left-0 w-full h-full bg-black bg-opacity-50"
                onClick={closeOverlay}
            >
                <div
                    className="relative bg-white w-full max-w-[470px] h-[70%] p-4 rounded-lg"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="w-full flex justify-end">
                        <button className="p-1.5 rounded-full bg-gray-300" onClick={closeOverlay}>
                            <AiOutlineClose size="26" />
                        </button>
                    </div>

                    {!isRegister ? <Register /> : <Login />}

                    <div className="absolute flex items-center justify-center py-5 left-0 bottom-0 border-t w-full">
                        <span className="text-[14px] text-gray-600">
                            {!isRegister ? "Do you have an account?" : "Don’t have an account?"}
                        </span>

                        <button
                            onClick={() => setIsRegister(!isRegister)}
                            className="text-[14px] text-[#F02C56] font-semibold pl-1"
                        >
                            <span>{isRegister ? "Register" : "Log in"}</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}