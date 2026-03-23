"use client";

import { useAtom } from "jotai";
import { Dashboard } from "@/components/dashboard";
import { Onboarding } from "@/components/onboarding";
import { RadarLoader } from "@/components/radar-loader";
import { settingsAtom } from "@/lib/store";
import type { UserSettings } from "@/lib/types";

export default function PlaneSpotter() {
	const [settings, setSettings] = useAtom(settingsAtom);

	const handleOnboardingComplete = (newSettings: UserSettings) => {
		setSettings(newSettings);
	};

	// atomWithStorage initialises synchronously on the client but returns null
	// on the very first render (before localStorage is hydrated). Show a loader.
	if (settings === undefined) {
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
