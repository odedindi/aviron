const CACHE_NAME = "plane-spotter-v1";
const STATIC_CACHE = "plane-spotter-static-v1";

// Assets to cache immediately on install
const PRECACHE_ASSETS = ["/", "/manifest.json"];

// Install event - cache static assets
self.addEventListener("install", (event) => {
	event.waitUntil(
		caches.open(STATIC_CACHE).then((cache) => {
			return cache.addAll(PRECACHE_ASSETS);
		}),
	);
	self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
	event.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames
					.filter((name) => name !== CACHE_NAME && name !== STATIC_CACHE)
					.map((name) => caches.delete(name)),
			);
		}),
	);
	self.clients.claim();
});

// Fetch event - network first for API, cache first for static
self.addEventListener("fetch", (event) => {
	const { request } = event;
	const url = new URL(request.url);

	// Skip non-GET requests
	if (request.method !== "GET") return;

	// API requests - network only (we want fresh flight data)
	if (url.pathname.startsWith("/api/")) {
		event.respondWith(
			fetch(request).catch(() => {
				// Return cached response if offline
				return caches.match(request);
			}),
		);
		return;
	}

	// Static assets - cache first, then network
	event.respondWith(
		caches.match(request).then((cached) => {
			if (cached) {
				// Return cached and update in background
				event.waitUntil(
					fetch(request)
						.then((response) => {
							if (response.ok) {
								caches.open(STATIC_CACHE).then((cache) => {
									cache.put(request, response);
								});
							}
						})
						.catch(() => {}),
				);
				return cached;
			}

			// Not cached - fetch and cache
			return fetch(request)
				.then((response) => {
					if (response.ok && response.type === "basic") {
						const responseToCache = response.clone();
						caches.open(STATIC_CACHE).then((cache) => {
							cache.put(request, responseToCache);
						});
					}
					return response;
				})
				.catch(() => {
					// Return offline page if available
					if (request.mode === "navigate") {
						return caches.match("/");
					}
					return new Response("Offline", { status: 503 });
				});
		}),
	);
});

// Handle push notifications (for future use)
self.addEventListener("push", (event) => {
	if (!event.data) return;

	const data = event.data.json();
	const options = {
		body: data.body,
		icon: "/icons/icon-192x192.png",
		badge: "/icons/icon-72x72.png",
		vibrate: [100, 50, 100],
		data: data.data,
	};

	event.waitUntil(self.registration.showNotification(data.title, options));
});
