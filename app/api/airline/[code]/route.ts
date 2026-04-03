import { type NextRequest, NextResponse } from "next/server";

const cache = new Map<string, string>();

export async function GET(
	_req: NextRequest,
	{ params }: { params: Promise<{ code: string }> },
) {
	const { code } = await params;
	const icao = code.toUpperCase();

	if (cache.has(icao)) {
		return NextResponse.json({ name: cache.get(icao) });
	}

	try {
		const res = await fetch(`https://api.adsbdb.com/v0/airline/${icao}`, {
			next: { revalidate: 86400 },
		});

		if (!res.ok) {
			return NextResponse.json({ name: null });
		}

		const data = await res.json();
		const name: string | null = data?.response?.[0]?.name ?? null;

		if (name) cache.set(icao, name);

		return NextResponse.json({ name });
	} catch {
		return NextResponse.json({ name: null });
	}
}
