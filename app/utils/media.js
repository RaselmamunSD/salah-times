export const getMediaProxyUrl = (url) => {
    if (!url || url === "null" || url === "undefined") {
        return null;
    }

    if (url.startsWith("/api/media/")) {
        return url;
    }

    const mediaSegment = "/media/";

    if (url.startsWith("http://") || url.startsWith("https://")) {
        try {
            const parsedUrl = new URL(url);
            const mediaIndex = parsedUrl.pathname.indexOf(mediaSegment);

            if (mediaIndex >= 0) {
                const mediaPath = parsedUrl.pathname.slice(mediaIndex + mediaSegment.length);
                return `/api/media/${mediaPath}`;
            }

            return url;
        } catch {
            return url;
        }
    }

    if (url.startsWith("/media/")) {
        return `/api/media/${url.slice("/media/".length)}`;
    }

    if (url.startsWith("media/")) {
        return `/api/media/${url.slice("media/".length)}`;
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    return `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
};