import ThemeToggle from "@/components/ThemeToggle";
import LanguageToggle from "@/components/LanguageToggle";

export default function AuthHeader() {
    return (
        <header className="border-b-2 border-neutral-600 flex items-center justify-between">
            <h1 className="font-bold text-2xl">Nextill</h1>
            <div>
                <LanguageToggle />
                <ThemeToggle />
            </div>
        </header>
    )
}