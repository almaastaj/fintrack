import React, { useContext } from "react";

import { authContext } from "@/lib/store/auth-context";
import { MdPersonOutline } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";

function SignIn() {
    const { googleLoginHandler, signInAsGuestHandler } =
        useContext(authContext);

    return (
        <main className="container max-w-2xl px-6 mx-auto">
            <h1 className="mb-6 text-5xl font-bold text-center">
                Welcome to FinTrack! <br />
                Hi,👋
            </h1>

            <div className="flex flex-col overflow-hidden shadow-md shadow-teal-400 bg-teal-600 rounded-2xl">
                <div className="h-52">
                    <img
                        className="object-cover w-full h-full"
                        // src="https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg"
                        src="/finance-definition.png"
                    />
                </div>

                <div className="px-2 py-2">
                    <h3 className="text-2xl text-center">
                        Please sign in to continue
                    </h3>

                    <button
                        onClick={googleLoginHandler}
                        className="flex self-start gap-2 p-4 mx-auto mt-2 font-medium text-black align-middle bg-teal-300 rounded-lg"
                    >
                        <FcGoogle className="text-2xl" /> Google
                    </button>
                </div>
                <div className="px-2 py-2">
                    <h3 className="text-2xl text-center">
                        continue as a guest
                    </h3>

                    <button
                        onClick={signInAsGuestHandler}
                        className="flex self-start gap-2 p-4 mx-auto mt-2 font-medium text-black align-middle bg-teal-300 rounded-lg"
                    >
                        <MdPersonOutline className="text-2xl" /> Guest
                    </button>
                </div>
            </div>
        </main>
    );
}

export default SignIn;
