/**
 * Server-side proxy for uploading a "shareable" image.
 *
 * Forwards the multipart/form-data request to Django's /api/share/upload/
 * and rewrites the returned image URL to point at the publicly reachable
 * Next.js /api/media/ proxy so that WhatsApp recipients can open it.
 *
 * POST /api/share-image
 *   Body: multipart/form-data with field "image"
 * Response: { image_url: "https://<public-host>/api/media/shared_images/..." }
 */

export async function POST(request) {
    const djangoBase =
        process.env.DJANGO_INTERNAL_URL ||
        process.env.NEXT_PUBLIC_API_URL ||
        "http://127.0.0.1:8000";

    // Prefer x-forwarded-host (set by Nginx) so we always use the real public domain.
    const incomingHost =
        request.headers.get("x-forwarded-host") ||
        request.headers.get("host") ||
        "";
    const incomingProto =
        request.headers.get("x-forwarded-proto") || "https";

    try {
        const body = await request.arrayBuffer();
        const contentType = request.headers.get("content-type") || "";

        const djangoResponse = await fetch(
            `${djangoBase.replace(/\/$/, "")}/api/share/upload/`,
            {
                method: "POST",
                headers: {
                    "Content-Type": contentType,
                    "X-Forwarded-Host": incomingHost,
                    "X-Forwarded-Proto": incomingProto,
                },
                body,
            }
        );

        const data = await djangoResponse.json();

        if (!djangoResponse.ok) {
            return Response.json(data, { status: djangoResponse.status });
        }

        // Rewrite the Django media URL to a public Next.js proxy URL.
        if (data.image_url) {
            try {
                const parsed = new URL(data.image_url);
                const match = parsed.pathname.match(/^\/media\/(.+)$/);
                if (match) {
                    data.image_url = `${incomingProto}://${incomingHost}/api/media/${match[1]}`;
                }
            } catch {
                // keep original
            }
        }

        return Response.json(data, { status: 200 });
    } catch (err) {
        console.error("[share-image proxy] error:", err);
        return Response.json(
            { error: "Failed to upload image. Please try again." },
            { status: 502 }
        );
    }
}
