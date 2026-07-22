import SettingsNav from "@/app/components/SettingsNav";

export default function Settings({ children }) {
    return (
        <div className="flex gap-3">
            <SettingsNav />
            <div className="w-[100%-20vw]">{children}</div>
        </div>
    )
}