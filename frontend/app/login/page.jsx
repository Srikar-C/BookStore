"use client"

import { FaUserAlt } from "react-icons/fa";
import InputBox from "../components/InputBox";
import { MdOutlinePassword } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import { SiBookstack } from "react-icons/si";
import Link from "next/link";
import useFetch from "../hooks/useFetch";
import { showError, showSuccess, showWarning } from "../utils/showToasts";
import { useRouter } from "next/navigation";
import { useAppContext } from "../hooks/AppContext";

export default function Login() {

    const router = useRouter();
    const [spin, setSpin] = useState(false);
    const isSubmit = useRef(false);
    const [loginUser, setLoginUser] = useState({
        name: "",
        password: ""
    });
    const [error, setError] = useState({
        nameError: "",
        passError: "",
    })

    const [color, setColor] = useState({
        nameColor: "text-red-400",
        passColor: "text-red-400",
    });

    const { user, loadingUser, initialize } = useAppContext();

    useEffect(() => {
        if (!loadingUser && user) {
            router.replace("/bookstore");
        }
    }, [loadingUser, user]);

    async function handleLogin() {
        if (isSubmit.current) return;
        setSpin(true);
        isSubmit.current = true;
        const response = await useFetch("post", process.env.NEXT_PUBLIC_API_User, process.env.NEXT_PUBLIC_MAPPING_User, "login", loginUser, true);
        const result = response.data;
        console.log("response: ", result);
        if (!result.success) {
            const errors = result.object;
            if (errors != null) {
                setError({
                    nameError: errors.name || "",
                    passError: errors.password || ""
                });
            }
            if (result.kind == "validation") {
                setColor({
                    nameColor: "text-red-400",
                    passColor: "text-red-400",
                })
            }
            else if (result.kind == "warning") {
                showWarning(result.message);
            }
            else if (result.kind == "info") {
                showInfo(result.message);
                console.log("Info: ", result.message);
            }
            else {
                showError(result.message);
            }
        }
        else {
            showSuccess(result.message);
            if (result.kind == "info") {
                router.replace(`/verify/${result.object.token}`);
            }
            else {
                await initialize();
                router.replace("/bookstore");
            }
        }
        setSpin(false);
        isSubmit.current = false;
    }

    return (
        <div className="box w-[25%] h-106 backdrop-blur-2xl bg-white/10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center p-4 gap-6 bg-[color-var(--foreground)] rounded-lg shadow-sm shadow-[color:var(--foreground)]" data-aos="flip-left">
            <div className="flex flex-col p-2 rounded-xl shadow-inner shadow-[color:var(--foreground)]">
                <SiBookstack className="text-5xl p-2 bg-[#4A7766] text-[#ECE7E2] rounded-xl justify-center" />
            </div>
            <div className="inputs flex flex-col gap-4 items-center space-y-1 *:w-full">
                <h1 className="heading font-semibold text-2xl text-[color:var(--heading)] text-center uppercase tracking-wider ">
                    Login
                </h1>
                <InputBox classid="name" field="name" icon={<FaUserAlt />} value={loginUser.name} object={loginUser} setObject={setLoginUser} type="text" placeholder="Enter Username/Email" spin={spin} error={error.nameError} color={color.nameColor} />
                <InputBox classid="pass" field="password" icon={<MdOutlinePassword />} value={loginUser.password} object={loginUser} setObject={setLoginUser} type="password" placeholder="Enter Password" spin={spin} error={error.passError} color={color.passColor} />
                <button
                    onClick={handleLogin}
                    disabled={spin}
                    className={`${spin ? "cursor-not-allowed" : "cursor-pointer"}
                    text-white px-3 py-1 justify-center mx-auto flex items-center gap-3 rounded-full bg-[#008236] hover:bg-[#4A7766] font-semibold`}
                >
                    Submit
                </button>
                <div className="font-medium text-center text-[color:var(--button)] gap-3 flex flex-row justify-center mx-auto">
                    {spin ? (
                        <span className="cursor-not-allowed">Forgot Password?</span>
                    ) : (
                        <Link href="/forgotPassword" className="hover:font-bold text-[color:var(--button)]">
                            Forgot Password?
                        </Link>
                    )}
                    <p>or</p>
                    {spin ? (
                        <span className="cursor-not-allowed">Sign in</span>
                    ) : (
                        <Link href="/register/" className="hover:font-bold text-[color:var(--button)]">
                            Sign in
                        </Link>
                    )}
                </div>
            </div>
        </div>
    )
}