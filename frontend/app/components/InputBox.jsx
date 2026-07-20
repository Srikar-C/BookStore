import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function InputBox({ classid, field, icon, value, object, setObject, type, placeholder, spin, error, color }) {

    const [showPassword, setShowPassword] = useState(false);

    function handleEye() {
        setShowPassword((prev) => !prev);
    }

    return (
        <div className={`${classid} relative flex flex-col w-full`}>
            <div className="input flex items-center bg-transparent rounded-xl w-full shadow-inner shadow-[color:var(--foreground)] gap-3 px-3 py-2">
                <span className="text-[color:var(--input)] w-6.25 text-xl">{icon}</span>
                <input
                    id="password"
                    type={type == "password" ? showPassword ? "text" : "password" : type}
                    className={`${spin ? "cursor-not-allowed" : ""
                        } border-none outline-none bg-transparent text-[color:var(--input)] font-medium`}
                    inputMode={classid == "phone" ? "numeric" : "text"}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => {
                        setObject((prev) => ({
                            ...prev,
                            [field]: e.target.value,
                        }))
                    }
                    }
                    disabled={spin}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            // handleLogin();
                            alert("Dfgdf");
                        }
                    }}
                />
                {type == "password" && <span
                    onClick={handleEye}
                    className="cursor-pointer text-[color:var(--input)]"
                >
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                </span>}
            </div>
            <div className={`error h-2 text-left text-sm ${color} font-semibold`}>
                {error}
            </div>
        </div>
    )
}