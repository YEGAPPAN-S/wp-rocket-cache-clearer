chrome.action.onClicked.addListener(() => {
    console.log("[Background] Button clicked - Clearing all caches.");

    chrome.storage.local.get(["nonceStorage"], (result) => {
        let storedNonces = result.nonceStorage || {};

        if (Object.keys(storedNonces).length === 0) {
            console.log("[Background] No stored nonces found.");
            return;
        }

        let clearedSites = [];

        for (const site in storedNonces) {
            console.log(`[Background] Clearing cache for ${site}`);
            clearedSites.push(site);
            for (const action in storedNonces[site]) {
                clearCacheForSite(site, action, storedNonces[site][action]);
            }
        }

        console.log("[Background] Cleared caches for:", clearedSites.join(", "));
        chrome.storage.local.set({ lastClearedSites: clearedSites });
    });
});

function clearCacheForSite(site, action, nonce) {
    const url = `https://${site}/wp-admin/admin-post.php?action=${action}&_wpnonce=${nonce}`;

    fetch(url, { method: "GET", credentials: "include" })
        .then(() => console.log(`[Background] Cache cleared for: ${site} - ${action}`))
        .catch(err => console.error(`[Background] Error clearing ${action} for ${site}:`, err));
}
