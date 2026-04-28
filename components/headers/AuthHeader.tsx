import ThemeToggle from "@/components/headers/ThemeToggle";
import { GradientDivider } from "../ui/dividers/Dividers";
import LanguageToggle from "@/components/language-toggle";

export default function AuthHeader() {
    return (
        <header className="sticky top-0 z-50  bg-slate-100/90 backdrop-blur dark:bg-slate-800/90">
            <div className="mx-auto max-w-screen-3xl px-4 sm:px-6 lg:px-8 py-2 xl:py-3">
                <div className="flex h-16 items-center justify-between gap-3">
                  <span 
                   className={`select-none text-xl xl:text-3xl font-semibold tracking-tight
                             text-slate-900 dark:text-slate-50`}
                  >
                    Nextill
                  </span>                  
                  <div className="flex items-center gap-2 lg:gap-4 xl:gap-6 xl:mr-8">
                    <LanguageToggle /> 
                    <ThemeToggle />     
                  </div>
                </div>
            </div>
            <GradientDivider />
        </header>
    )
}