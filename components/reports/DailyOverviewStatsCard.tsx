
type props = {
    title1: string;
    title2: string;
    value1: string | number;
    value2: string | number;
}

export default function DailyOverviewStatsCard({title1, title2, value1, value2}: props){
    return (
        <article className="mt-3 rounded-lg border border-border/60 bg-muted/30 px-3 py-2">
            <div className="flex items-center justify-between gap-3 text-xs">
                <span className="text-muted-foreground">
                    {title1}
                </span>
                <span className="font-medium text-foreground">
                    {value1}
                </span>
            </div>
            
            <div className="mt-1.5 flex items-center justify-between gap-3 text-xs">
                <span className="text-muted-foreground">
                    {title2}
                </span>
                <span className="font-medium text-foreground">
                    {value2}
                </span>
            </div>
        </article>
    )
}