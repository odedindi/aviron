import { type NextRequest, NextResponse } from "next/server";
import type { ApiErrorCode } from "@/lib/types";

interface TokenCache {
	token: string;
	expiresAt: number;
}

const tokenCache = new Map<string, TokenCache>();

async function fetchFreshToken(
	clientId: string,
	clientSecret: string,
): Promise<string | null> {
	try {
		const res = await fetch(
			"https://auth.opensky-network.org/auth/realms/opensky-network/protocol/openid-connect/token",
			{
				method: "POST",
				headers: { "Content-Type": "application/x-www-form-urlencoded" },
				body: new URLSearchParams({
					grant_type: "client_credentials",
					client_id: clientId,
					client_secret: clientSecret,
				}),
				cache: "no-store",
			},
		);

		if (!res.ok) {
			console.error(
				`OpenSky token fetch failed: ${res.status} ${res.statusText}`,
			);
			return null;
		}

		const json = await res.json();
		if (!json.access_token) {
			console.error("OpenSky token response missing access_token:", json);
			return null;
		}

		const expiresInMs = (json.expires_in ?? 1800) * 1000;
		tokenCache.set(`${clientId}:${clientSecret}`, {
			token: json.access_token,
			expiresAt: Date.now() + expiresInMs,
		});

		return json.access_token;
	} catch (err) {
		console.error("OpenSky token fetch error:", err);
		return null;
	}
}

async function getBearerToken(
	clientId: string,
	clientSecret: string,
): Promise<string | null> {
	const cached = tokenCache.get(`${clientId}:${clientSecret}`);
	if (cached && cached.expiresAt - Date.now() > 60_000) {
		return cached.token;
	}
	return fetchFreshToken(clientId, clientSecret);
}

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const lat = parseFloat(searchParams.get("lat") || "0");
	const lon = parseFloat(searchParams.get("lon") || "0");
	const radius = parseFloat(searchParams.get("radius") || "20");

	const clientId =
		request.headers.get("x-opensky-client-id") ||
		process.env.OPENSKY_CLIENT_ID ||
		"";
	const clientSecret =
		request.headers.get("x-opensky-client-secret") ||
		process.env.OPENSKY_CLIENT_SECRET ||
		"";

	const latDelta = radius / 111;
	const lonDelta = radius / (111 * Math.cos((lat * Math.PI) / 180));

	const lamin = lat - latDelta;
	const lamax = lat + latDelta;
	const lomin = lon - lonDelta;
	const lomax = lon + lonDelta;

	const url = `https://opensky-network.org/api/states/all?lamin=${lamin}&lomin=${lomin}&lamax=${lamax}&lomax=${lomax}`;

	try {
		const headers: HeadersInit = { Accept: "application/json" };

		if (clientId && clientSecret) {
			const token = await getBearerToken(clientId, clientSecret);
			if (token) headers.Authorization = `Bearer ${token}`;
		}

		let response = await fetch(url, { headers, next: { revalidate: 30 } });

		if (response.status === 401 && clientId && clientSecret) {
			tokenCache.delete(`${clientId}:${clientSecret}`);
			const freshToken = await fetchFreshToken(clientId, clientSecret);
			if (freshToken) {
				headers.Authorization = `Bearer ${freshToken}`;
				response = await fetch(url, { headers, next: { revalidate: 30 } });
			}
		}

		if (!response.ok) {
			console.error(
				`OpenSky returned ${response.status} ${response.statusText}`,
			);
			const errorCode: ApiErrorCode =
				response.status === 429
					? "quota_exceeded"
					: response.status === 401
						? "invalid_credentials"
						: "api_unavailable";
			return NextResponse.json({
				states: null,
				time: Date.now() / 1000,
				demoMode: true,
				errorCode,
			});
		}

		const data = await response.json();
		return NextResponse.json({ ...data, demoMode: false });
	} catch (error) {
		console.error("OpenSky API error:", error);
		return NextResponse.json({
			states: null,
			time: Date.now() / 1000,
			demoMode: true,
			errorCode: "api_unavailable" satisfies ApiErrorCode,
			error: "Failed to fetch flight data",
		});
	}
}
