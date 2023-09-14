function hasSuccess(outcome: unknown): outcome is { success: boolean } {
    return !!outcome && 'success' in (outcome as { success: unknown });
}

export async function validate_turnstile(turnstile_key: string, token: string | null, ip?: string | null): Promise<boolean> {
    if (token === null) return false;
    let formData = new FormData();
    formData.append("secret", turnstile_key);
    formData.append("response", token);
    if (ip !== null && ip !== undefined) formData.append("remoteip", ip);

    const result = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
            body: formData,
            method: "POST",
        }
    );

    const outcome = await result.json();

    return hasSuccess(outcome) && outcome.success === true;
}