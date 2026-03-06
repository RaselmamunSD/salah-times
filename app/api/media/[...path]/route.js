/**
 * Media proxy route — streams media files from the Django backend.
 *
 * Requests to /api/media/mosque_images/photo.png are fetched from
 * http://127.0.0.1:8000/media/mosque_images/photo.png and returned
 * to the browser with the correct Content-Type.
 *
 * This lets WhatsApp recipients open images even when the Django server
 * is only reachable locally, as long as the Next.js server has a
 * public-facing URL (e.g. a Cloudflare tunnel).
 */

export async function GET(request, { params }) {
    const pathSegments = params.path; // string[]
    if (!pathSegments || pathSegments.length === 0) {
        return new Response("Not found", { status: 404 });
    }

    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    const mediaPath = pathSegments.join("/");
    const targetUrl = `${apiBase.replace(/\/$/, "")}/media/${mediaPath}`;

    try {
        const upstreamResponse = await fetch(targetUrl, { cache: "no-store" });

        if (!upstreamResponse.ok) {
            return new Response("Media not found", {
                status: upstreamResponse.status,
            });
        }

        const contentType =
            upstreamResponse.headers.get("content-type") || "application/octet-stream";
        const buffer = await upstreamResponse.arrayBuffer();

        return new Response(buffer, {
            status: 200,
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=86400",
            },
        });
    } catch {
        return new Response("Failed to fetch media", { status: 502 });
    }
}
