/**
 * Server-side proxy for mosque registration.
 *
 * Forwards the request to Django with the correct X-Forwarded-Host so that
 * Django's build_absolute_uri() returns the publicly reachable Next.js URL
 * (Cloudflare tunnel, production domain, etc.) instead of 127.0.0.1.
 *
 * The image URL Django returns will then be:
 *   https://<nextjs-public-host>/media/mosque_images/...
 * which is served by the /api/media/[...path] proxy route.
 */

export async function POST(request) {
    const djangoBase =
        process.env.DJANGO_INTERNAL_URL ||
        process.env.NEXT_PUBLIC_API_URL ||
        "http://127.0.0.1:8000";

    const incomingHost = request.headers.get("host") || "";
    const incomingProto = request.headers.get("x-forwarded-proto") || "http";

    try {
        const body = await request.arrayBuffer();
        const contentType = request.headers.get("content-type") || "";
        const authorization = request.headers.get("authorization") || "";

        const djangoResponse = await fetch(
            `${djangoBase.replace(/\/$/, "")}/api/mosques/register/`,
            {
                method: "POST",
                headers: {
                    "Content-Type": contentType,
                    ...(authorization ? { Authorization: authorization } : {}),
                    // Tell Django the real public host so build_absolute_uri() works
                    "X-Forwarded-Host": incomingHost,
                    "X-Forwarded-Proto": incomingProto,
                },
                body,
            }
        );

        const data = await djangoResponse.json();

        // Replace the media host in the returned image URL with our own proxy path.
        // This ensures the link is always accessible via Next.js regardless of
        // whether the original URL points to 127.0.0.1 or a tunnel.
        if (data.prayer_timetable_image_url) {
            try {
                const parsed = new URL(data.prayer_timetable_image_url);
                const match = parsed.pathname.match(/^\/media\/(.+)$/);
                if (match) {
                    // Return a relative path — the frontend will prepend window.location.origin
                    data.prayer_timetable_image_path = `/api/media/${match[1]}`;
                }
            } catch {
                // keep original
            }
        }

        return Response.json(data, { status: djangoResponse.status });
    } catch (err) {
        console.error("[register-mosque proxy] error:", err);
        return Response.json(
            { detail: "Failed to connect to backend. Please try again." },
            { status: 502 }
        );
    }
}
