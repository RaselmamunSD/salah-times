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
        // Build a fully-qualified public URL using the incoming request's host so
        // the link works in WhatsApp regardless of whether Django is on localhost.
        if (data.prayer_timetable_image_url) {
            try {
                const parsed = new URL(data.prayer_timetable_image_url);
                const match = parsed.pathname.match(/^\/media\/(.+)$/);
                if (match) {
                    // Relative path (kept for backward compat)
                    data.prayer_timetable_image_path = `/api/media/${match[1]}`;
                    // Fully-qualified public URL — use the incoming host so the
                    // link is always reachable (tunnel, production domain, etc.)
                    data.prayer_timetable_image_shareable_url = `${incomingProto}://${incomingHost}/api/media/${match[1]}`;
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
