/**
 * POST /admin/upload: hands the browser a short-lived token so it can upload
 * a file straight to Vercel Blob (so there are no size limits from this
 * server). Signed-in admins only. Called by _lib/upload.ts. Needs
 * BLOB_READ_WRITE_TOKEN; without it, uploads fail with a clear message.
 */
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const body = (await request.json()) as HandleUploadBody;
  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        return {
          allowedContentTypes: ["video/mp4", "video/webm", "video/quicktime", "image/jpeg", "image/png", "image/webp"],
          maximumSizeInBytes: 300 * 1024 * 1024,
          addRandomSuffix: true,
        };
      },
    });
    return NextResponse.json(result);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    const hint = /token/i.test(msg) ? "Uploads need Vercel Blob: add BLOB_READ_WRITE_TOKEN to .env.local (see README)." : msg;
    return NextResponse.json({ error: hint }, { status: 400 });
  }
}
