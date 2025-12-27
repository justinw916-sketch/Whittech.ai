# Ultimate Beginner's Deployment Guide (Hostinger)

This guide assumes you are on Windows and have never deployed a Node.js app before. We will do this step-by-step.

## Phase 1: Uploading Your Files
We will use Hostinger's **File Manager** because it is easier than setting up FTP.

1.  Log in to your **Hostinger Dashboard**.
2.  Go to **Websites** -> **Manage**.
3.  On the left sidebar, verify you have a **VPS** or **Cloud** plan that supports Node.js. (If you are on "Shared Hosting", look for a "Node.js" icon in the dashboard).
4.  Open **File Manager**.
5.  Navigate to `public_html`. (Delete a `default.php` file if you see one).
6.  **Upload** the *contents* of your `upload` folder here.
    *   *Tip: It's faster to verify you are uploading the right things. You should see `server.js`, `package.json`, and a `public` folder inside `public_html`.*

## Phase 2: Connecting via SSH (Windows)
SSH helps you "remote control" the server to turn on the website.

1.  **Find your Login Details**:
    *   In Hostinger Dashboard, go to **Advanced** -> **SSH Access**.
    *   Note down your **IP Address**, **Username** (e.g., `u123456789`), and **Password**. (If you don't know the password, click "Change Password" to set a new one).

2.  **Open PowerShell**:
    *   Press the `Windows Key` on your keyboard.
    *   Type `PowerShell` and press Enter.

3.  **Type the Connection Command**:
    *   Type this command (replace with YOUR details):
        ```powershell
        ssh username@ip_address
        ```
        *Example: `ssh u123456789@185.123.45.67`*
    *   Press **Enter**.

4.  **Enter Password**:
    *   It will ask for your password.
    *   **IMPORTANT**: When you type your password, **nothing will appear on the screen** (no stars, no dots). This is normal security. Just type it and press **Enter**.
    *   If successful, you will see a welcome message.

## Phase 3: Turning on the App

1.  **Go to your folder**:
    Type this command to verify you are in the right folder (usually `public_html` or `domains/yourdomain.com/public_html`):
    ```bash
    cd public_html
    ```
    *(If your files are in a different folder, change `public_html` to that folder name).*

2.  **Install the "Engine" (Node Modules)**:
    This downloads all the libraries your app needs.
    ```bash
    npm install
    ```
    *Wait for it to finish. It might take a minute.*

3.  **Install the "Manager" (PM2)**:
    This tool keeps your site running 24/7.
    ```bash
    npm install -g pm2
    ```

4.  **Launch the Site**:
    We created a special file `ecosystem.config.js` to make this easy.
    ```bash
    pm2 start ecosystem.config.js
    ```
    *You should see a green "online" status in the table that appears.*

5.  **Save the State**:
    This ensures the site comes back online if the server restarts.
    ```bash
    pm2 save
    pm2 startup
    ```

## Phase 4: Troubleshooting
**"I see a 403 Forbidden error"**
- Check that you deleted the default `index.php` or `default.php` file.
- Ensure your `server.js` file is uploaded.

**"The site is loading forever"**
- In Hostinger, check that your **Firewall** allows traffic on port `3000` (if applicable), or simpler:
- In `server.js`, we set the port to `3000`. Some shared hosting requires you to use a specific port. Check your Hostinger Node.js settings to see if they assign a specific port.
