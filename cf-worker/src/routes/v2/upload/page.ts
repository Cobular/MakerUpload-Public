import { Env } from "../../..";
import { RouteHandler } from "../../../types";
import { validate_turnstile } from "../../../utils/turnstile";

// 1. Initialize the upload
const INIT = (async (
    url: URL,
    request: Request,
    env: Env,
    ctx: ExecutionContext
): Promise<Response> => {
    const file_name = url.searchParams.get("file_name");
    const token = url.searchParams.get("token");
    const ip = request.headers.get("CF-Connecting-IP");

    if (!file_name) {
        return new Response("Missing parameters", { status: 400 });
    }

    let turnstile_success = await validate_turnstile(env.TURNSTILE_KEY, token, ip);
    if (!turnstile_success) {
        return new Response(`Captcha failed`, { status: 400 });
    }

    const multipartUpload = await env.FILE_CACHE_BUCKET.createMultipartUpload(file_name);

    return new Response(JSON.stringify({
        key: multipartUpload.key,
        uploadId: multipartUpload.uploadId,
    }), { status: 200 });
}) satisfies RouteHandler;

// 2. Upload a part
const UPLOAD_PART = (async (
    url: URL,
    request: Request,
    env: Env,
    ctx: ExecutionContext
): Promise<Response> => {
    const uploadId = url.searchParams.get("uploadId");
    const partNumberString = url.searchParams.get("partNumber");
    const token = url.searchParams.get("token");
    const ip = request.headers.get("CF-Connecting-IP");
    const key = url.searchParams.get("key");

    let turnstile_success = await validate_turnstile(env.TURNSTILE_KEY, token, ip);
    if (!turnstile_success) {
        return new Response(`Captcha failed`, { status: 400 });
    }

    if (!uploadId || !partNumberString || !key) {
        return new Response("Missing parameters", { status: 400 });
    }

    if (request.body === null) {
        return new Response("Missing request body", { status: 400 });
    }

    const partNumber = parseInt(partNumberString);
    const multipartUpload = env.FILE_CACHE_BUCKET.resumeMultipartUpload(
        key,
        uploadId
    );
    try {
        const uploadedPart: R2UploadedPart = await multipartUpload.uploadPart(partNumber, request.body);
        return new Response(JSON.stringify(uploadedPart));
    } catch (error: any) {
        return new Response(error.message, { status: 400 });
    }
}) satisfies RouteHandler;

// 3. Complete the upload
const COMPLETE = (async (
    url: URL,
    request: Request,
    env: Env,
    ctx: ExecutionContext
): Promise<Response> => {
    const uploadId = url.searchParams.get("uploadId");
    const key = url.searchParams.get("key");
    const token = url.searchParams.get("token");
    const ip = request.headers.get("CF-Connecting-IP");

    if (!uploadId || !key) {
        return new Response("Missing parameters", { status: 400 });
    }

    let turnstile_success = await validate_turnstile(env.TURNSTILE_KEY, token, ip);
    if (!turnstile_success) {
        return new Response(`Captcha failed`, { status: 400 });
    }

    const multipartUpload = env.FILE_CACHE_BUCKET.resumeMultipartUpload(
        key,
        uploadId
    );

    interface completeBody {
        parts: R2UploadedPart[];
    }
    const completeBody: completeBody = await request.json();
    if (completeBody === null) {
        return new Response("Missing or incomplete body", {
            status: 400,
        });
    }

    // Error handling in case the multipart upload does not exist anymore
    try {
        const object = await multipartUpload.complete(completeBody.parts);
        return new Response(null, {
            headers: {
                etag: object.httpEtag,
            },
        });
    } catch (error: any) {
        return new Response(error.message, { status: 400 });
    }
}) satisfies RouteHandler;