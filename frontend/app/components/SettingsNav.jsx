"use client"

import GradingIcon from '@mui/icons-material/Grading';
import { MdLogout } from 'react-icons/md';
import { RiProfileLine, RiSettingsFill } from "react-icons/ri";
import { useAppContext } from '../hooks/AppContext';

export default function SettingsNav() {

    const { theme } = useAppContext();

    return (
        <div className="settings relative flex flex-col gap-3 items-center w-[20vw] border-r-2 border-[color:var(--foreground)] h-screen -mt-[14vh] pt-[14vh]">
            <div className="categories flex flex-col gap-5 items-start w-full *:w-full">
                <div className="orders flex gap-2 items-center cursor-pointer px-3 py-2">
                    <GradingIcon sx={{ fontSize: "30px" }} />
                    <span className="text-xl">Orders</span>
                </div>
                <hr className={`${theme ? "text-gray-700" : "text-gray-200"}`} />
                <div className="profile flex gap-2 items-center cursor-pointer px-3 py-2">
                    <RiProfileLine className="text-3xl" />
                    <span className="text-xl">Profile</span>
                </div>
                <hr className={`${theme ? "text-gray-700" : "text-gray-200"}`} />
                <div className="others flex gap-2 items-center cursor-pointer px-3 py-2">
                    <RiSettingsFill className="text-3xl" />
                    <span className="text-xl">Others</span>
                </div>
                <hr className={`${theme ? "text-gray-700" : "text-gray-200"}`} />
            </div>
            <div className="logout absolute bottom-5 mx-auto flex gap-2 items-center cursor-pointer">
                <MdLogout className="text-3xl" />
                <span className="text-xl">Logout</span>
            </div>
        </div>
    )
}