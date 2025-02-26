if (!window.location.href.includes("/wp-admin/")) {
    console.warn("[Content Script] Not running in WordPress Admin, skipping script.");
} else {
    const siteKey = window.location.hostname;
    console.log(`[Content Script] Running in: ${siteKey}`);

    function extractAllNonces() {
        let nonces = {};
        const links = document.querySelectorAll(`a[href*="admin-post.php"]`);
        links.forEach(link => {
            const url = new URL(link.href);
            const action = url.searchParams.get("action");
            const nonce = url.searchParams.get("_wpnonce");
            if (action && nonce) {
                nonces[action] = nonce;
            }
        });
        return nonces;
    }

    function storeNonces() {
        let nonces = extractAllNonces();
        if (Object.keys(nonces).length > 0) {
            chrome.storage.local.get(["nonceStorage"], (result) => {
                let storedNonces = result.nonceStorage || {};
                storedNonces[siteKey] = { ...storedNonces[siteKey], ...nonces };
                chrome.storage.local.set({ nonceStorage: storedNonces }, () => {
                    console.log(`[Content Script] Updated nonces for ${siteKey}`);
                });
            });
        }
    }

    // Auto-refresh nonces every 3 hours
    setInterval(storeNonces, 3 * 60 * 60 * 1000);

    // Store immediately when visiting wp-admin
    storeNonces();
}
