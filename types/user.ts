export interface UserProfile {
    uid : string
    email : string | null
    displayName : string | null
    createdAt : unknown
    jadeLilyCredit : number
    jadeLilyTotalOrders : number 
    jadeLilyCart : []
    jadeLilyPastOrders : []
    jadeLilyCreditUsed : number
    nextillApp: {
        settings: {
            darkmode: boolean
            language: string
            dayActive: boolean
            dayDate: string | null
        }
        dayCycle: {
            active: boolean
            startedAt: unknown | null
            endedAt: unknown | null
            openingBalance: number | null
            closingBalance: number | null
        }
    }
}