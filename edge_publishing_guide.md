# Microsoft Edge Extension Publishing Guide

Follow these steps to submit the packaged extension to the **Microsoft Edge Add-ons Store** for free.

---

## 📦 Your Packaged Extension

The extension has been successfully prepared, icons generated, and packaged:
- **Packaged ZIP File:** [extension-package.zip](file:///e:/New%20folder/extension-package.zip)
- **Manifest File:** [manifest.json](file:///e:/New%20folder/extension/manifest.json)
- **Icons Directory:** [icons/](file:///e:/New%20folder/extension/icons)

---

## 🚀 Step 1: Create a Microsoft Partner Center Account

1. Go to the [Microsoft Partner Center Developer Portal](https://partner.microsoft.com/en-us/dashboard/microsoftedge/public/login).
2. Sign in with your Microsoft account (Outlook, Hotmail, etc.).
3. Choose **Individual** registration.
4. Fill in your details.
   - **Cost:** 100% Free (Microsoft does not charge a registration fee).
   - Approval is usually instant or takes up to 24 hours.

---

## 📤 Step 2: Create a New Submission

1. Once logged in, click **Create new extension** (or **Overview** -> **Create new**).
2. Enter the name: **Activity Tracker** (or your preferred store listing name).
3. Click **Create**.

---

## 🛠️ Step 3: Fill Out the Submission Forms

The submission process consists of 3 main parts:

### 1. Packages
- Drag and drop your **[extension-package.zip](file:///e:/New%20folder/extension-package.zip)** file here.
- The dashboard will automatically parse your `manifest.json` and verify the package.

### 2. Properties
- **Category:** Choose a relevant category (e.g., *Productivity* or *Developer Tools*).
- **Privacy Policy URL:** (Optional, but recommended) A link to your privacy policy if the extension stores data.
- **Support Contact Details:** Your support email or website.

### 3. Store Listing
- **Description:** Provide a description explaining what the extension does (e.g., tracks time and activity across websites).
- **Icon:** Upload a **300x300 pixel PNG** or **150x150 pixel PNG** for the store listing. You can use the generated 128x128 icon or resize the main icon if needed.
- **Screenshots:** Add at least 1 screenshot (1280x800 or 640x400 PNG/JPEG) of your extension in action.

---

## 📬 Step 4: Submit for Review

1. Click **Submit** at the bottom right.
2. The extension will go into the review queue. Microsoft Edge review typically takes **1 to 3 business days**.
3. You will receive an email once it is approved and published on the Edge Add-ons store!

---

## 💡 Quick local testing in Edge
Before submitting, you can verify it works locally:
1. Open Microsoft Edge and go to `edge://extensions`.
2. Turn on the **Developer mode** toggle in the bottom left.
3. Click **Load unpacked** in the top left.
4. Select the **[extension](file:///e:/New%20folder/extension)** folder from your workspace.
