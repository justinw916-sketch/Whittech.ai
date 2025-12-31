# WhitTech.AI Client Portal
## User Guide & Documentation

---

## Table of Contents

1. [Overview](#overview)
2. [Admin Portal](#admin-portal)
   - Logging In
   - Managing Client Accounts
   - Editing Client Projects
   - Uploading Documents
3. [Client Portal](#client-portal)
   - Logging In
   - Dashboard Overview
   - Downloading Documents
4. [Cloud Storage](#cloud-storage)

---

## Overview

The WhitTech.AI Client Portal is a secure web-based system that allows:

- **Administrators** to manage client accounts, update project details, and upload documents
- **Clients** to view their project progress, download documents, and access invoices

**Portal URL:** `https://whittech.ai/portal`

---

## Admin Portal

### Logging In

1. Navigate to `https://whittech.ai/portal`
2. Enter your admin credentials:
   - **Username:** `admin`
   - **Password:** `admin1`
3. Click **Sign In**

You will be redirected to the Admin Portal dashboard.

---

### Managing Client Accounts

#### Creating a New Client

1. Click the **"+ Add Client"** button (purple button, top right)
2. Fill in the required fields:
   - **Username** - Client's login username
   - **Password** - Client's login password
   - **Client/Company Name** - Display name for the client
   - **Project Name** - Name of their project
   - **Start Date** - Project start date
   - **Est. Completion** - Estimated completion date
   - **Contact Person** - Project manager name
   - **Contact Email** - Project manager email
   - **Contact Phone** - Project manager phone
3. Click **"Create Account"**

The new client will appear in your client list.

#### Viewing a Client Dashboard

1. Find the client in your list
2. Click the **"View"** button (eye icon)
3. A preview of exactly what the client sees will appear

#### Deleting a Client

1. Find the client in your list
2. Click the **trash icon** button
3. Confirm the deletion when prompted

> ⚠️ **Warning:** Deleting a client removes all their data permanently.

---

### Editing Client Projects

1. Find the client in your list
2. Click the **"Edit"** button (pencil icon)
3. A modal window opens with **5 tabs**:

#### Tab 1: Project
- Update project name, status, and progress percentage
- Modify dates and contact information

#### Tab 2: Phases
- Set project phases to: **Pending**, **Active**, or **Completed**
- Phases include: Planning, Design, Development, Testing, Launch

#### Tab 3: Documents
- Click **"Upload File"** to add documents (stored in cloud)
- View existing documents with download/delete options
- Files are stored securely in Cloudflare R2

#### Tab 4: Updates
- Click **"+ Add Update"** to post a new project update
- Enter a message describing the latest progress
- Updates appear in reverse chronological order

#### Tab 5: Invoices
- Click **"+ Add Invoice"** to create a new invoice
- Enter the invoice amount
- Toggle invoice status between **Pending** and **Paid**

4. Click **"Save Changes"** when finished

---

### Uploading Documents

1. Edit a client's project
2. Go to the **Documents** tab
3. Click **"Upload File"**
4. Select a file from your computer
5. Wait for the upload to complete (you'll see a loading indicator)
6. The file will appear in the list with:
   - Filename
   - File size
   - Download button
   - Delete button

**Supported file types:** All common file types (PDF, DOC, XLS, images, etc.)

**Maximum file size:** 100 MB per file

---

## Client Portal

### Logging In

1. Navigate to `https://whittech.ai/portal`
2. Enter the credentials provided by your administrator
3. Click **Sign In**

You will be redirected to your personalized project dashboard.

---

### Dashboard Overview

Your dashboard displays:

#### Project Overview Card
- **Project Name** and current **Status** badge
- **Progress Bar** showing overall completion percentage
- **Start Date** and **Estimated Completion** date
- **Financial Summary:** Total invoiced and amount paid

#### Project Phases
A visual timeline showing the status of each phase:
- ✅ **Completed** (green checkmark)
- 🔄 **Active** (blue clock icon)
- ⏳ **Pending** (gray icon)

#### Documents
- List of all documents uploaded by your project manager
- Click the **download button** to save files to your computer

#### Recent Updates
- Chronological feed of project updates and announcements
- Most recent updates appear first

#### Invoices
- Complete list of all invoices
- Shows invoice ID, amount, date, and payment status

#### Your Project Manager
- Contact information for your assigned project manager
- Includes name, email, and phone number

---

### Downloading Documents

1. Scroll to the **Documents** section on your dashboard
2. Find the document you want to download
3. Click the **download button** (down arrow icon)
4. The file will download to your computer

---

## Cloud Storage

All documents are stored securely using **Cloudflare R2 Object Storage**.

### Benefits:
- ✅ **Secure** - Enterprise-grade encryption
- ✅ **Fast** - Global CDN delivery
- ✅ **Reliable** - 99.999% durability
- ✅ **No egress fees** - Download as much as needed

### For Administrators:
Files are organized by client with the path structure:
```
clients/{username}/{timestamp}_{filename}
```

You can view all stored files in the Cloudflare Dashboard:
1. Go to `dash.cloudflare.com`
2. Navigate to **R2 Object Storage**
3. Open the **client-portal-files** bucket

---

## Support

For technical support or questions, contact:

**Email:** jwhitton@zoho.com

**Website:** whittech.ai/contact

---

*© 2025 WhitTech.AI - All Rights Reserved*
