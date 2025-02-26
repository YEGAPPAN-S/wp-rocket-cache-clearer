function getStoredSites(callback) {
    chrome.storage.local.get(["nonceStorage"], (result) => {
        callback(result.nonceStorage || {});
    });
}

document.getElementById("clear-all").addEventListener("click", () => {
    getStoredSites((storedNonces) => {
        if (Object.keys(storedNonces).length === 0) {
            updateStatus("No stored sites. Please log in first.");
            return;
        }

        updateStatus("Clearing caches...");

        let clearedSites = [];
        let clearedItems = {};
        let failedItems = {};

        const actions = ["purge_cache", "rocket_clean_saas", "rocket_clean_performance_hints"];

        for (const site in storedNonces) {
            clearedSites.push(site);
            clearedItems[site] = [];
            failedItems[site] = [];

            actions.forEach(action => {
                if (storedNonces[site][action]) {
                    clearCacheForSite(site, action, storedNonces[site][action], clearedItems, failedItems, site);
                } else {
                    failedItems[site].push(action); // Mark missing nonces
                }
            });
        }

        setTimeout(() => {
            let summary = `<strong>Cleared for ${clearedSites.length} sites:</strong><br><br>`;
            for (const site in clearedItems) {
                summary += `<strong>${site}</strong><br>`;
                clearedItems[site].forEach(action => {
                    summary += `- ${formatAction(action)}<br>`;
                });

                if (failedItems[site].length > 0) {
                    summary += `<span style="color: red;">Not cleared: ${failedItems[site].map(formatAction).join(", ")}</span><br>`;
                }
                summary += `<br>`; // Space between sites
            }
            updateStatus(summary);
        }, 3000);
    });
});

function clearCacheForSite(site, action, nonce, clearedItems, failedItems, siteKey) {
    const url = `https://${site}/wp-admin/admin-post.php?action=${action}&_wpnonce=${nonce}`;

    fetch(url, { method: "GET", credentials: "include" })
        .then(response => {
            if (response.ok) {
                console.log(`[Popup] Cache cleared for ${site} - ${action}`);
                clearedItems[site].push(action);
            } else {
                console.error(`[Popup] Failed to clear ${action} for ${site}, retrying...`);
                retryCacheClear(siteKey, action, clearedItems, failedItems);
            }
        })
        .catch(err => {
            console.error(`[Popup] Error clearing ${action} for ${site}:`, err);
            retryCacheClear(siteKey, action, clearedItems, failedItems);
        });
}

function retryCacheClear(site, action, clearedItems, failedItems) {
    chrome.storage.local.get(["nonceStorage"], (result) => {
        let storedNonces = result.nonceStorage || {};
        if (storedNonces[site] && storedNonces[site][action]) {
            console.log(`[Popup] Retrying ${action} for ${site}`);
            clearCacheForSite(site, action, storedNonces[site][action], clearedItems, failedItems, site);
        } else {
            console.error(`[Popup] No nonce available for ${action} on ${site}`);
            failedItems[site].push(action);
        }
    });
}

function updateStatus(message) {
    document.getElementById("status").innerHTML = message;
}

function formatAction(action) {
    const actionMapping = {
        "purge_cache": "Cache & Preload",
        "rocket_clean_saas": "Used CSS",
        "rocket_clean_performance_hints": "Priority Elements"
    };
    return actionMapping[action] || action;
}
