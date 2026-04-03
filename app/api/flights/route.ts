import { type NextRequest, NextResponse } from "next/server";
import type { ApiErrorCode } from "@/lib/types";

const ICAO_COUNTRY_RANGES: [number, number, string][] = [
	[0x004000, 0x0043ff, "Zimbabwe"],
	[0x006000, 0x006fff, "Mozambique"],
	[0x008000, 0x00ffff, "South Africa"],
	[0x010000, 0x017fff, "Egypt"],
	[0x018000, 0x01ffff, "Libya"],
	[0x020000, 0x027fff, "Morocco"],
	[0x028000, 0x02ffff, "Tunisia"],
	[0x030000, 0x0303ff, "Botswana"],
	[0x032000, 0x032fff, "Burundi"],
	[0x034000, 0x034fff, "Cameroon"],
	[0x038000, 0x038fff, "Congo"],
	[0x03e000, 0x03efff, "Ethiopia"],
	[0x040000, 0x040fff, "Ivory Coast"],
	[0x042000, 0x042fff, "Gabon"],
	[0x044000, 0x044fff, "Ghana"],
	[0x046000, 0x046fff, "Guinea"],
	[0x048000, 0x0483ff, "Kenya"],
	[0x04a000, 0x04a3ff, "Lesotho"],
	[0x04c000, 0x04cfff, "Liberia"],
	[0x050000, 0x050fff, "Madagascar"],
	[0x054000, 0x054fff, "Mali"],
	[0x058000, 0x058fff, "Mauritania"],
	[0x05a000, 0x05a3ff, "Mauritius"],
	[0x05c000, 0x05cfff, "Niger"],
	[0x060000, 0x060fff, "Nigeria"],
	[0x062000, 0x062fff, "Uganda"],
	[0x064000, 0x064fff, "Senegal"],
	[0x068000, 0x068fff, "Somalia"],
	[0x06c000, 0x06cfff, "Sudan"],
	[0x070000, 0x070fff, "Tanzania"],
	[0x074000, 0x0743ff, "Chad"],
	[0x076000, 0x0763ff, "Togo"],
	[0x078000, 0x078fff, "Zambia"],
	[0x07c000, 0x07cfff, "Rwanda"],
	[0x080000, 0x080fff, "Angola"],
	[0x084000, 0x084fff, "Djibouti"],
	[0x088000, 0x088fff, "Malawi"],
	[0x08c000, 0x08cfff, "Namibia"],
	[0x090000, 0x090fff, "Sierra Leone"],
	[0x094000, 0x0943ff, "Swaziland"],
	[0x098000, 0x0983ff, "Eritrea"],
	[0x100000, 0x1fffff, "Russia"],
	[0x201000, 0x2013ff, "Namibia"],
	[0x202000, 0x2023ff, "Eritrea"],
	[0x300000, 0x33ffff, "Italy"],
	[0x340000, 0x37ffff, "Spain"],
	[0x380000, 0x3bffff, "France"],
	[0x3c0000, 0x3fffff, "Germany"],
	[0x400000, 0x43ffff, "United Kingdom"],
	[0x440000, 0x447fff, "Austria"],
	[0x448000, 0x44ffff, "Belgium"],
	[0x450000, 0x457fff, "Bulgaria"],
	[0x458000, 0x45ffff, "Denmark"],
	[0x460000, 0x467fff, "Finland"],
	[0x468000, 0x46ffff, "Greece"],
	[0x470000, 0x477fff, "Hungary"],
	[0x478000, 0x47ffff, "Norway"],
	[0x480000, 0x487fff, "Netherlands"],
	[0x488000, 0x48ffff, "Poland"],
	[0x490000, 0x497fff, "Portugal"],
	[0x498000, 0x49ffff, "Czechia"],
	[0x4a0000, 0x4a7fff, "Romania"],
	[0x4b0000, 0x4b7fff, "Sweden"],
	[0x4b8000, 0x4bffff, "Switzerland"],
	[0x4c0000, 0x4c7fff, "Ireland"],
	[0x4c8000, 0x4cffff, "Slovakia"],
	[0x4d0000, 0x4d7fff, "Luxembourg"],
	[0x4d8000, 0x4dffff, "Slovenia"],
	[0x4e0000, 0x4e7fff, "Latvia"],
	[0x4e8000, 0x4effff, "Lithuania"],
	[0x4f0000, 0x4f7fff, "Estonia"],
	[0x4f8000, 0x4fffff, "Cyprus"],
	[0x500000, 0x5003ff, "Iceland"],
	[0x501000, 0x5013ff, "Malta"],
	[0x501c00, 0x501fff, "Albania"],
	[0x502000, 0x502fff, "Croatia"],
	[0x503000, 0x503fff, "Serbia"],
	[0x504000, 0x504fff, "Bosnia and Herzegovina"],
	[0x505000, 0x5053ff, "Kosovo"],
	[0x506000, 0x5063ff, "North Macedonia"],
	[0x507000, 0x5073ff, "Montenegro"],
	[0x508000, 0x5083ff, "Moldova"],
	[0x600000, 0x6003ff, "Armenia"],
	[0x600800, 0x600bff, "Azerbaijan"],
	[0x601000, 0x6013ff, "Georgia"],
	[0x601800, 0x601bff, "Kyrgyzstan"],
	[0x602000, 0x6023ff, "Tajikistan"],
	[0x602800, 0x602bff, "Turkmenistan"],
	[0x603000, 0x6033ff, "Uzbekistan"],
	[0x604000, 0x6043ff, "Ukraine"],
	[0x604800, 0x604bff, "Belarus"],
	[0x640000, 0x6403ff, "Bahrain"],
	[0x640800, 0x640bff, "Iraq"],
	[0x641000, 0x6413ff, "Jordan"],
	[0x641800, 0x641bff, "Kuwait"],
	[0x642000, 0x6423ff, "Lebanon"],
	[0x642800, 0x642bff, "Oman"],
	[0x643000, 0x6433ff, "Qatar"],
	[0x643800, 0x643bff, "Saudi Arabia"],
	[0x644000, 0x6443ff, "Syria"],
	[0x644800, 0x644bff, "UAE"],
	[0x645000, 0x6453ff, "Yemen"],
	[0x645800, 0x645bff, "Israel"],
	[0x680000, 0x6803ff, "Afghanistan"],
	[0x681000, 0x6813ff, "Bangladesh"],
	[0x682000, 0x6823ff, "Myanmar"],
	[0x683000, 0x6833ff, "Kazakhstan"],
	[0x684000, 0x6843ff, "Sri Lanka"],
	[0x685000, 0x6853ff, "Nepal"],
	[0x686000, 0x6863ff, "Pakistan"],
	[0x687000, 0x6873ff, "Philippines"],
	[0x688000, 0x6883ff, "Cambodia"],
	[0x689000, 0x6893ff, "South Korea"],
	[0x68a000, 0x68afff, "North Korea"],
	[0x68b000, 0x68bfff, "Malaysia"],
	[0x68c000, 0x68cfff, "Mongolia"],
	[0x68d800, 0x68dbff, "Myanmar"],
	[0x690000, 0x6903ff, "Brunei"],
	[0x691000, 0x6913ff, "Papua New Guinea"],
	[0x692000, 0x6923ff, "Laos"],
	[0x693000, 0x6933ff, "Vietnam"],
	[0x694000, 0x6943ff, "Indonesia"],
	[0x695000, 0x6953ff, "Singapore"],
	[0x696000, 0x6963ff, "Taiwan"],
	[0x697000, 0x6973ff, "Thailand"],
	[0x698000, 0x6983ff, "Timor-Leste"],
	[0x700000, 0x700fff, "Kazakhstan"],
	[0x702000, 0x702fff, "Kyrgyzstan"],
	[0x704000, 0x704fff, "China"],
	[0x706000, 0x706fff, "Japan"],
	[0x708000, 0x708fff, "India"],
	[0x70a000, 0x70afff, "Iran"],
	[0x710000, 0x717fff, "Japan"],
	[0x720000, 0x727fff, "India"],
	[0x730000, 0x737fff, "China"],
	[0x738000, 0x73ffff, "China"],
	[0x740000, 0x747fff, "China"],
	[0x748000, 0x74ffff, "China"],
	[0x750000, 0x757fff, "China"],
	[0x780000, 0x7bffff, "United States"],
	[0x7c0000, 0x7fffff, "Australia"],
	[0x800000, 0x83ffff, "India"],
	[0x840000, 0x87ffff, "Japan"],
	[0x880000, 0x887fff, "South Korea"],
	[0x888000, 0x88ffff, "South Korea"],
	[0x890000, 0x890fff, "New Zealand"],
	[0x895000, 0x8953ff, "Fiji"],
	[0x900000, 0x9003ff, "Canada"],
	[0xc00000, 0xc3ffff, "Canada"],
	[0xc80000, 0xc8ffff, "New Zealand"],
	[0xe00000, 0xe3ffff, "Argentina"],
	[0xe40000, 0xe7ffff, "Brazil"],
	[0xe80000, 0xe80fff, "Chile"],
	[0xe84000, 0xe843ff, "Ecuador"],
	[0xe88000, 0xe883ff, "Paraguay"],
	[0xe8c000, 0xe8c3ff, "Peru"],
	[0xe90000, 0xe90fff, "Uruguay"],
	[0xe94000, 0xe943ff, "Bolivia"],
	[0xe98000, 0xe983ff, "Colombia"],
	[0xe9c000, 0xe9c3ff, "Venezuela"],
	[0xf00000, 0xf07fff, "Mexico"],
	[0xf09000, 0xf093ff, "Costa Rica"],
	[0xf09800, 0xf09bff, "Cuba"],
	[0xf0a000, 0xf0a3ff, "El Salvador"],
	[0xf0a800, 0xf0abff, "Guatemala"],
	[0xf0b000, 0xf0b3ff, "Haiti"],
	[0xf0b800, 0xf0bbff, "Honduras"],
	[0xf0c000, 0xf0c3ff, "Jamaica"],
	[0xf0c800, 0xf0cbff, "Nicaragua"],
	[0xf0d000, 0xf0d3ff, "Panama"],
	[0xf0d800, 0xf0dbff, "Dominican Republic"],
	[0xf0e000, 0xf0e3ff, "Trinidad and Tobago"],
	[0xf80000, 0xf807ff, "Iran"],
];

function icaoToCountry(hex: string): string {
	const n = parseInt(hex, 16);
	if (Number.isNaN(n)) return "";
	for (const [lo, hi, country] of ICAO_COUNTRY_RANGES) {
		if (n >= lo && n <= hi) return country;
	}
	return "";
}

interface AirplanesLiveAircraft {
	hex: string;
	flight?: string;
	lat?: number;
	lon?: number;
	alt_baro?: number | string;
	alt_geom?: number;
	gs?: number;
	track?: number;
	baro_rate?: number;
	squawk?: string;
	spi?: boolean;
	mlat?: string[];
	tisb?: string[];
}

interface AirplanesLiveResponse {
	ac: AirplanesLiveAircraft[];
	now: number;
	total: number;
	msg: string;
}

function toOpenskyState(
	ac: AirplanesLiveAircraft,
): (string | number | boolean | null)[] {
	const altBaro = typeof ac.alt_baro === "number" ? ac.alt_baro * 0.3048 : null;
	const altGeom = typeof ac.alt_geom === "number" ? ac.alt_geom * 0.3048 : null;
	const velocityMs = typeof ac.gs === "number" ? ac.gs * 0.514444 : null;
	const onGround = ac.alt_baro === "ground";

	return [
		ac.hex, // 0  icao24
		ac.flight ?? null, // 1  callsign
		icaoToCountry(ac.hex), // 2  originCountry
		null, // 3  timePosition
		null, // 4  lastContact
		ac.lon ?? null, // 5  longitude
		ac.lat ?? null, // 6  latitude
		altBaro, // 7  baroAltitude (m)
		onGround, // 8  onGround
		velocityMs, // 9  velocity (m/s)
		ac.track ?? null, // 10 trueTrack
		ac.baro_rate ?? null, // 11 verticalRate
		null, // 12 sensors
		altGeom, // 13 geoAltitude (m)
		ac.squawk ?? null, // 14 squawk
		ac.spi ?? false, // 15 spi
		0, // 16 positionSource
	];
}

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const lat = parseFloat(searchParams.get("lat") || "0");
	const lon = parseFloat(searchParams.get("lon") || "0");
	const radius = parseFloat(searchParams.get("radius") || "20");

	const url = `https://api.airplanes.live/v2/point/${lat}/${lon}/${Math.ceil(radius)}`;

	try {
		const response = await fetch(url, { next: { revalidate: 30 } });

		if (!response.ok) {
			console.error(
				`airplanes.live returned ${response.status} ${response.statusText}`,
			);
			const errorCode: ApiErrorCode = "api_unavailable";
			return NextResponse.json({
				states: null,
				time: Date.now() / 1000,
				demoMode: true,
				errorCode,
			});
		}

		const data: AirplanesLiveResponse = await response.json();

		return NextResponse.json({
			states: data.ac.map(toOpenskyState),
			time: data.now / 1000,
			demoMode: false,
		});
	} catch (error) {
		console.error("airplanes.live API error:", error);
		return NextResponse.json({
			states: null,
			time: Date.now() / 1000,
			demoMode: true,
			errorCode: "api_unavailable" satisfies ApiErrorCode,
			error: "Failed to fetch flight data",
		});
	}
}
