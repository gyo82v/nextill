this is my database structure:

{
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
            currency: string
            balanceEnabled: boolean
            ticketEnabled: boolean
            receiptEnabled: boolean
            disableMotion: boolean
        }
        dayCycle: {
            active: boolean
            startedAt: unknown | null
            endedAt: unknown | null
            openingBalance: number | null
            closingBalance: number | null
            dayKey: string | null
            nextTicketNumber: number
        }
        statistics: {
            itemsSales: {
                {14csvL6AopD7oIZ3y8o9: 16}
                {14csvL6fapD7oIZsdfo9: 34}
            }
            lastSaleAt: 6 June 2026 at 17:37:09 UTC+1
            totalEarnings: 233453
            totalTransactions: 165
            unitsSoldTotal: 444
        }
    menuItems(collection): uid : {
        category: "food"
        createdAt: 8 June 2026 at 16:19:20 UTC+1
        ingredients: [
            {
                quantity: number,
                stockId: string
            }
        ]
        name: "example"
        priceMinor: 2345
        updatedAt: 8 may 2026 at 16:19:20 UTC+1
        active: false(only archieved items have this)
        archievedAt: 20 may 2026 at 13:11:05 UTC+1(only archieved items have this)
    }
    dailySummaries(collection): 2026-04-16(one per day) : {
        date: "2026-04-16"
        earnings: 890
        transactions: 2
        updatedAt: 16 April 2026 at 17:27:48 UTC+1
        transactions(collection): uid : {
            createdAt: 16 April 2026 at 17:22:58 UTC+1
            dayKey: "2026-04-16"
            itemCount: 3
            status: "completed"
            totalMinor: 590
            items: [
                {
                    id: "2"
                    name: "Croissant"
                    priceMinor: 220
                    quantity: 2
                }
            ]
        }

    }
    stock(collection): uid: {
        active: false(only archieved items have this)
        archivedAt: 16 May 2026 at 16:28:05 UTC+1(only archieved items have this)
        category: "food"
        createdAt:15 May 2026 at 17:59:31 UTC+1
        minQty: 5
        name: "example"
        quantity: number
        unit: string
        updatedAt: 16 May 2026 at 16:28:05 UTC+1
    }
    stockActivuty(collection): uid: {
        action: "add"
        createdAt: 20 May 2026 at 13:10:57 UTC+1
        itemName: "limonata"
        quantityAfter: 100
        quantityBefore: 0
        quantityDelta: 100
        stockId: "iLOIK8jVNTb4odHcblKL"
    }
    }
}