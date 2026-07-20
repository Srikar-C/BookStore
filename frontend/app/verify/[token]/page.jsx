"use client"

import useFetch from "@/app/hooks/useFetch";
import { showError, showInfo, showSuccess, showWarning } from "@/app/utils/showToasts";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { RiRefreshLine } from "react-icons/ri";
import { SiBookstack } from "react-icons/si"
import OTPInput from "react-otp-input";


export default function Verify() {

    const token = useParams();
    const router = useRouter();
    const [spin, setSpin] = useState(false);
    const isSubmit = useRef(false);

    const [user, setUser] = useState({
        email: "",
        otp: ""
    })

    async function getEmailFromToken() {
        const response = await useFetch("post", process.env.NEXT_PUBLIC_API_Auth, process.env.NEXT_PUBLIC_MAPPING_Auth, "verifyToken", token, false);
        const result = response.data;
        if (!result.success) {
            showError(result.message);
        }
        else {
            //showSuccess(result.message);
            setUser((prev) => ({
                ...prev,
                email: result.object.email,
            }))
        }
    }

    useEffect(() => {
        getEmailFromToken();
    }, [token]);

    async function handleVerify() {
        if (isSubmit.current) return;
        setSpin(true);
        isSubmit.current = true;
        const response = await useFetch("post", process.env.NEXT_PUBLIC_API_User, process.env.NEXT_PUBLIC_MAPPING_User, "verifyOTP", user, false);
        const result = response.data;
        console.log("response: ", result);
        if (!result.success) {
            setUser((prev) => ({
                ...prev,
                otp: ""
            }))
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
            router.replace("/login");
        }
        setSpin(false);
        isSubmit.current = false;
    }

    async function handleResend() {
        if (isSubmit.current) return;
        setSpin(true);
        isSubmit.current = true;
        const response = await useFetch("post", process.env.NEXT_PUBLIC_API_User, process.env.NEXT_PUBLIC_MAPPING_User, "resendOTP", user, false);
        const result = response.data;
        console.log("response: ", result);
        if (!result.success) {
            setUser((prev) => ({
                ...prev,
                otp: ""
            }))
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
            setUser((prev) => ({
                ...prev,
                otp: ""
            }))
        }
        setSpin(false);
        isSubmit.current = false;
    }

    return (
        <div className="box w-[25%] h-95 backdrop-blur-2xl bg-white/10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center p-4 gap-6 rounded-lg shadow-sm shadow-[color:var(--foreground)]" data-aos="flip-right">
            <div className="flex flex-col p-2 rounded-xl shadow-inner shadow-[color:var(--foreground)]">
                <SiBookstack className="text-5xl p-2 bg-[#4A7766] text-[#ECE7E2] rounded-xl justify-center" />
            </div>
            <div className="inputs flex flex-col gap-4 items-center space-y-1 *:w-full">
                <h1 className="heading font-semibold text-2xl text-[color:var(--heading)] text-center uppercase tracking-wider">
                    Verify Email
                </h1>
                <p>Enter the verification code we sent to your email address: <b>{user.email}</b></p>
                <div className="tags flex flex-row justify-between w-full items-center">
                    <span className="font-semibold">Verification Code</span>
                    <div className={`${spin ? "cursor-not-allowed" : "cursor-pointer"} resend flex items-center gap-2 text-[color:var(--button)] cursor-pointer border-2 border-[color:var(--button)] rounded-full px-2 hover:bg-[color:var(--button)] hover:text-[color:var(--background)]`} onClick={handleResend}
                        disabled={spin}>
                        <RiRefreshLine />
                        <span>Resend Code</span>
                    </div>
                </div>
                <div className="input w-full justify-center">
                    <OTPInput value={user.otp} onChange={(value) => {
                        setUser((prev) => ({
                            ...prev,
                            otp: value
                        }))
                    }} numInputs={6} renderSeparator={<span>-</span>} renderInput={(props) => <input {...props} />} inputStyle={{ width: "2.2rem", height: "2.2rem", border: "1px solid var(--foreground)", borderRadius: "0.25rem", margin: "0rem 0.5rem 0rem 0.5rem", display: "flex", justifyContent: "center", textAlign: "center" }}
                        containerStyle={{ display: "flex", justifyContent: "space-between", width: "100%" }} />
                </div>
                <button
                    onClick={handleVerify}
                    disabled={spin}
                    className={`${spin ? "cursor-not-allowed" : "cursor-pointer"}
                            text-white px-3 py-1 justify-center mx-auto flex items-center gap-3 rounded-full bg-[#008236] hover:bg-[#4A7766] font-semibold`}
                >
                    Verify
                </button>
            </div>
        </div>
    )
}
