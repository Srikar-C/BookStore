"use client"

import { useRef, useState } from "react"
import { FaPhoneAlt, FaUserAlt } from "react-icons/fa";
import { MdEmail, MdOutlinePassword } from "react-icons/md";
import { SiBookstack } from "react-icons/si";
import { TbPassword } from "react-icons/tb";
import InputBox from "../components/InputBox";
import Link from "next/link";
import useFetch from "../hooks/useFetch";
import { showSuccess } from "../utils/showToasts";
import { useRouter } from "next/navigation";

export default function Register() {

    const router = useRouter();

    const [spin, setSpin] = useState(false);
    const isSubmit = useRef(false);
    const [registerUser, setRegisterUser] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        cfnpassword: "",
        role: "USER",
    });
    const [error, setError] = useState({
        nameError: "",
        emailError: "",
        phoneError: "",
        passError: "",
        cfnpassError: "",
    })

    const [color, setColor] = useState({
        nameColor: "text-red-400",
        emailColor: "text-red-400",
        phoneColor: "text-red-400",
        passColor: "text-red-400",
        cfnpassColor: "text-red-400",
    })

    async function handleRegister() {
        if (isSubmit.current) return;
        setSpin(true);
        isSubmit.current = true;
        const response = await useFetch("post", process.env.NEXT_PUBLIC_API_User, process.env.NEXT_PUBLIC_MAPPING_User, "register", registerUser, false);
        const result = response.data;
        if (!result.success) {
            const errors = result.object;
            setError({
                nameError: errors.name || "",
                emailError: errors.email || "",
                phoneError: errors.phone || "",
                passError: errors.password || "",
                cfnpassError: errors.cfnpassword || ""
            });
            if (result.kind == "exists") {
                setColor({
                    nameColor: "text-yellow-400",
                    emailColor: "text-yellow-400",
                    phoneColor: "text-yellow-400",
                    passColor: "text-yellow-400",
                    cfnpassColor: "text-yellow-400",
                })
            }
            else if (result.kind == "validation") {
                setColor({
                    nameColor: "text-red-400",
                    emailColor: "text-red-400",
                    phoneColor: "text-red-400",
                    passColor: "text-red-400",
                    cfnpassColor: "text-red-400",
                })
            }
            setRegisterUser((prev) => ({
                ...prev,
                name: errors.name ? "" : prev.name,
                email: errors.email ? "" : prev.email,
                phone: errors.phone ? "" : prev.phone,
                password: errors.password ? "" : prev.password,
                cfnpassword: errors.cfnpassword ? "" : prev.cfnpassword,
            }));
            if (result.kind == "error") {
                showError(result.message);
            }
            else if (result.kind == "warning") {
                showWarning(result.message);
            }
            else if (result.kind == "info") {
                showInfo(result.message);
                console.log("Info: ", result.message);
            }
        }
        else {
            showSuccess(result.message);
            router.replace(`/verify/${result.object.token}`);
        }
        console.log("response from backend: ", response.data);
        setSpin(false);
        isSubmit.current = false;
    }

    return (
        <div className="box w-[25%] h-150 backdrop-blur-2xl bg-white/10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center p-4 gap-6 rounded-lg shadow-sm shadow-[color:var(--foreground)]" data-aos="flip-right">
            <div className="flex flex-col p-2 rounded-xl shadow-inner shadow-[color:var(--foreground)]">
                <SiBookstack className="text-5xl p-2 bg-[#4A7766] text-[#ECE7E2] rounded-xl justify-center" />
            </div>
            <div className="inputs flex flex-col gap-4 items-center space-y-1 *:w-full">
                <h1 className="heading font-semibold text-2xl text-[color:var(--heading)] text-center uppercase tracking-wider">
                    Register
                </h1>
                <InputBox classid="name" field="name" icon={<FaUserAlt />} value={registerUser.name} object={registerUser} setObject={setRegisterUser} type="text" placeholder="Enter Username" spin={spin} error={error.nameError} color={color.nameColor} />
                <InputBox classid="email" field="email" icon={<MdEmail />} value={registerUser.email} object={registerUser} setObject={setRegisterUser} type="text" placeholder="Enter Email" spin={spin} error={error.emailError} color={color.emailColor} />
                <InputBox classid="phone" field="phone" icon={<FaPhoneAlt />} value={registerUser.phone} object={registerUser} setObject={setRegisterUser} type="text" placeholder="Enter Phone Number" spin={spin} error={error.phoneError} color={color.phoneColor} />
                <InputBox classid="pass" field="password" icon={<TbPassword />} value={registerUser.password} object={registerUser} setObject={setRegisterUser} type="password" placeholder="Enter Password" spin={spin} error={error.passError} color={color.passColor} />
                <InputBox classid="cfnpass" field="cfnpassword" icon={<MdOutlinePassword />} value={registerUser.cfnpassword} object={registerUser} setObject={setRegisterUser} type="password" placeholder="Confirm Password" spin={spin} error={error.cfnpassError} color={color.cfnpassColor} />
                <button
                    onClick={handleRegister}
                    disabled={spin}
                    className={`${spin ? "cursor-not-allowed" : "cursor-pointer"}
                    text-white px-3 py-1 justify-center mx-auto flex items-center gap-3 rounded-full bg-[#008236] hover:bg-[#4A7766] font-semibold`}
                >
                    Submit
                </button>
                <div className="font-medium text-center text-[color:var(--button)] gap-3 flex flex-row justify-center mx-auto">
                    {spin ? (
                        <span className="cursor-not-allowed">
                            Sign up
                        </span>
                    ) : (
                        <Link href="/login" className="hover:font-bold text-[color:var(--button)]">
                            Sign up
                        </Link>
                    )}
                </div>
            </div>
        </div>
    )
}