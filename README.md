# WP Rocket Cache Clearer Extension

A Chrome extension to clear the cache of multiple **WordPress websites** with **one click**. Automatically handles **WP Rocket cache actions** for **all logged-in sites**.

## Features

- **Single Button Cache Clearing**: Clears cache for all sites you've logged into with a single click.
- **Supports Multiple Cache Actions**: Clears **Cache & Preload**, **Used CSS**, and **Priority Elements**.
- **Automatically Refreshes Nonces**: Ensures nonces are valid by auto-refreshing every 3 hours.
- **Detailed Status Report**: Shows which cache types were cleared for each site and if any actions failed.
- **Handles Multiple WordPress Sites**: Supports any WordPress site logged into `wp-admin`.

## Installation

1. **Clone the repository** or **download the ZIP** file.
2. Go to **chrome://extensions/** in your browser.
3. **Enable Developer Mode** in the top right.
4. Click **Load Unpacked** and select the folder containing the extension files.
5. The extension will now be active in your browser.

## Usage

1. **Log in to any WordPress site** (admin panel `wp-admin`).
2. Once logged in, the extension will **automatically store the necessary nonces** for each site.
3. Whenever you want to clear the cache for **all sites**, simply **click the extension icon**.
4. The extension will show a **detailed report** in the popup of which sites were cleared and which cache actions were performed.

## How It Works

1. **Nonces**: The extension collects the necessary nonces (`_wpnonce`) when logged into `wp-admin` pages.
2. **Periodic Refresh**: Every 3 hours, the extension **automatically refreshes the stored nonces** to prevent expiration.
3. **Cache Clearing**: When you click the extension, it sends requests to each site's **`admin-post.php`** to clear the appropriate caches for that site.
