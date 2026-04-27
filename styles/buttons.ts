import { focusRing } from "./focus"
import { transitions, activePress } from "./patterns"

export const iconsBtn = `inline-flex h-11 w-11 items-center justify-center rounded-xl
                         bg-surface-2 text-muted border border-default shadow-sm
                         hover-surface-1
                         ${focusRing} ${transitions} ${activePress}`