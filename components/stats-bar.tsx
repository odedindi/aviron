"use client";

import { memo } from "react";
import type { Stats } from "@/lib/types";

interface StatsBarProps {
	stats: Stats;
}

export const StatsBar = memo(function StatsBar({ stats }: StatsBarProps) {
	return (
		<div className="border-border border-t bg-card/50 px-4 py-2">
			<div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-muted-foreground text-xs">
				<span>
					<span className="text-primary">TODAY:</span> {stats.todayCount}
				</span>
				<span className="hidden sm:inline">|</span>
				<span>
					<span className="text-primary">BUSIEST:</span> {stats.busiestHour}
				</span>
				<span className="hidden sm:inline">|</span>
				<span>
					<span className="text-primary">OVERHEAD:</span> {stats.overheadCount}
				</span>
				<span className="hidden sm:inline">|</span>
				<span>
					<span className="text-primary">LAST:</span>{" "}
					{stats.lastFlight || "N/A"}
				</span>
			</div>
		</div>
	);
});
