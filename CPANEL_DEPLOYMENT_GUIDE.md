# 🚀 Turnkey cPanel Deployment Guide — Crisp Cleaners CRM (`crispcleaners.ca`)

This guide provides step-by-step instructions to deploy your complete **Crisp Cleaners CRM** to any cPanel hosting account.

---

## 📦 What's Included in Your Turnkey Codebase

- **Full-Stack Express & Vite Architecture**: Bundled server with all Gemini AI endpoints and static frontend.
- **`app.cjs`**: cPanel / Phusion Passenger entry point for 1-click boot.
- **`.htaccess`**: Pre-configured Apache routing with HTML5 history rewrite rules (prevents 404 on refresh) and Gzip compression.
- **`dist/` Build System**: Single-command production compiler (`npm run build`).
- **`ecosystem.config.cjs`**: PM2 configuration for VPS/Dedicated cPanel setups.

---

## 🌟 Method 1: cPanel "Setup Node.js App" (Recommended — Full AI Features)

Most modern cPanel hosts (Namecheap, Hostinger, SiteGround, A2 Hosting, cPanel CloudLinux) feature **"Setup Node.js App"** in the cPanel Dashboard.

### Step 1: Export / Download the Project Files
1. In AI Studio, click the **Settings / Code Menu** (top right) ➔ **Export ZIP** (or clone the repository via Git).
2. On your computer, open a terminal in the project folder and run:
   ```bash
   npm install
   npm run build
   ```
3. This creates the production bundle inside `dist/` and `dist/server.cjs`.

### Step 2: Prepare Your ZIP for cPanel
Select all files in the project root **except** `node_modules` (or include the built `dist/`, `app.cjs`, `package.json`, `.htaccess`, `.env.example`).
Compress these into a zip archive named `crisp-crm.zip`.

### Step 3: Create the Node.js Application in cPanel
1. Log in to your **cPanel Dashboard**.
2. Under the **Software** section, click **"Setup Node.js App"** (or *NodeJS Selector*).
3. Click the **"Create Application"** button:
   - **Node.js version**: Select `18.x`, `20.x`, or `22.x` (Latest Recommended).
   - **Application mode**: Select `Production`.
   - **Application root**: Enter `crisp-crm` (or your preferred subfolder name).
   - **Application URL**: Select your domain (e.g., `crispcleaners.ca` or `crm.crispcleaners.ca`).
   - **Application startup file**: Enter `app.cjs` (or `dist/server.cjs`).
4. Click **"Create"** (top right).

### Step 4: Upload Your Files
1. Open cPanel **File Manager**.
2. Navigate to your application root directory (e.g., `/home/username/crisp-crm`).
3. Click **Upload** and upload your `crisp-crm.zip`.
4. Right-click `crisp-crm.zip` and select **Extract**.

### Step 5: Configure Environment Variables
1. Back in **"Setup Node.js App"**, scroll down to the **Environment Variables** section.
2. Click **"Add Variable"**:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: `[Your Gemini API Key from Google AI Studio]`
3. Click **"Add Variable"**:
   - **Name**: `NODE_ENV`
   - **Value**: `production`
4. Click **Save**.

### Step 6: Install Production Dependencies & Start
1. In the **Setup Node.js App** screen, click the **"Run NPM Install"** button.
   *(Alternatively, copy the virtualenv command shown at the top of the cPanel page, open the cPanel Terminal, paste it, and run `npm install --omit=dev`)*.
2. Click the **"Restart"** button (or **"Start App"**).
3. Visit your domain (e.g. `https://crispcleaners.ca`) — your full-stack CRM is live!

---

## ⚡ Method 2: Static SPA Upload to `public_html` (Quickest for Static Frontend)

If your cPanel hosting is standard shared hosting without the Node.js selector:

1. On your local machine, run:
   ```bash
   npm install
   npm run build
   ```
2. Open the generated `dist/` directory.
3. In cPanel **File Manager**, navigate into `public_html/` (or your subdomain folder).
4. Upload all files and folders directly from inside `dist/` into `public_html/`:
   - `index.html`
   - `assets/`
   - `.htaccess` *(Ensure "Show Hidden Files" is enabled in cPanel File Manager Settings)*
5. The pre-configured `.htaccess` file handles all client-side route rewrites and asset caching automatically.

---

## 🔧 Useful cPanel Maintenance Commands (Terminal / SSH)

If you have SSH access to your cPanel server:

```bash
# 1. Enter your app folder
cd ~/crisp-crm

# 2. Enter cPanel Node.js virtual environment (example path)
source /home/username/nodevenv/crisp-crm/20/bin/activate

# 3. Rebuild and restart app
npm run build
touch tmp/restart.txt
```

---

## 🛠️ Troubleshooting FAQ

| Issue | Cause | Solution |
|---|---|---|
| **503 Service Unavailable** | Passenger failed to start `app.cjs` | Check `stderr.log` in your app folder. Verify that `dist/server.cjs` exists (run `npm run build`). |
| **404 Not Found on Page Reload** | Missing Apache rewrite rules | Ensure the `.htaccess` file was uploaded to `public_html` or the app root. |
| **Missing AI responses** | `GEMINI_API_KEY` not configured in cPanel | In cPanel "Setup Node.js App", add `GEMINI_API_KEY` under Environment Variables and restart. |
| **CSS / Images Not Loading** | Incorrect base URL path | Ensure files are in the domain root or update `base` in `vite.config.ts` if deployed in a subfolder like `/crm/`. |
