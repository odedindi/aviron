"use client";

import { useEffect, useRef, useState } from "react";
import type { FlightData } from "@/lib/types";

function icaoPrefix(callsign: string): string | null {
	const cs = callsign.trim().toUpperCase();
	if (cs.length < 3) return null;
	const prefix = cs.slice(0, 3);
	if (!/^[A-Z]{3}$/.test(prefix)) return null;
	return prefix;
}

export function useAirlineNames(flights: FlightData[]): Record<string, string> {
	const [names, setNames] = useState<Record<string, string>>({});
	const inFlight = useRef<Set<string>>(new Set());

	useEffect(() => {
		const prefixes = new Set<string>();
		for (const f of flights) {
			const p = icaoPrefix(f.callsign);
			if (p && !names[p] && !inFlight.current.has(p)) prefixes.add(p);
		}

		if (prefixes.size === 0) return;

		for (const prefix of prefixes) {
			inFlight.current.add(prefix);
			fetch(`/api/airline/${prefix}`)
				.then((r) => r.json())
				.then(({ name }: { name: string | null }) => {
					inFlight.current.delete(prefix);
					if (name) {
						setNames((prev) => ({ ...prev, [prefix]: name }));
					}
				})
				.catch(() => {
					inFlight.current.delete(prefix);
				});
		}
	}, [flights, names]);

	return names;
}
