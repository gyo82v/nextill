before proceeding here is a recap of the statistics we will implements:

1 globals, all times:

uid => nextillApp => statistics => 

- totalEarnings: number,
- totalTransactions: number,
- itemsSales : {burgers: number, water: number}(these are the dishes not the stock items),
- topItems: here the top 5 items(not sure if we need this or we can deduct from itemsSales)


2 current day:
uid => dailySummaries => 2026-04-20 => 
- date: 2026-04-20,
- earnings: number(total eranings of this day),
- transactions: number(total transactions of this day),
- updatedAt : 20 April 2026 at 16:43:53 UTC+1
transactions(collection of each single transaction) => transaction uid =>
- createdAt: 20 April 2026 at 16:22:17 UTC+1,
- dayKey: 2026-04-18,
- itemCount: number,
- status: completed,
- totalMinor: integer number,
- items: [
    {
        menuId: "HW9vKRgpPiEmhjpXkeRA",
        name: "burger",
        priceMinor: integer number,
        quantity: number
    }
]


3 days overview statistics:
we dont anything saved in the database at the moment for this.
what we need for each day:
- total earnings;
- total transactions;
- the date;
- most sold item;


what do you think about this ? do you have anything to add that may be helpfull but not too performace demending?

please do a recap on the step in order we should take to achieve this and any advises

