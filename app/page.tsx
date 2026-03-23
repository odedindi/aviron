"use client";

import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { Dashboard } from "@/components/dashboard";
import { Onboarding } from "@/components/onboarding";
import { RadarLoader } from "@/components/radar-loader";
import { settingsAtom } from "@/lib/store";
import type { UserSettings } from "@/lib/types";

export default function PlaneSpotter() {
	const [settings, setSettings] = useAtom(settingsAtom);
	// atomWithStorage reads localStorage synchronously, but only after the
	// component mounts (client-side). Track mount so we never flash Onboarding.
	const [mounted, setMounted] = useState(false);
	useEffect(() => setMounted(true), []);

	const handleOnboardingComplete = (newSettings: UserSettings) => {
		setSettings(newSettings);
	};

	if (!mounted) {
		return (
			<div className="scanlines flex h-screen items-center justify-center bg-background">
				<div className="space-y-4 text-center">
					<div className="mx-auto h-16 w-16">
						<RadarLoader
							className="glow-pulse h-full w-full text-primary"
							title="Loading"
						/>
					</div>
					<p className="text-primary text-sm">INITIALIZING...</p>
				</div>
			</div>
		);
	}

	if (!settings?.onboardingComplete) {
		return <Onboarding onComplete={handleOnboardingComplete} />;
	}

	return <Dashboard />;
}
