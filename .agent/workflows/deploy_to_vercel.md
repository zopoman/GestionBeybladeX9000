---
description: Deploy the application to Vercel
---

# Deploy to Vercel

This workflow guides you through deploying your Vite React application to Vercel.

## Prerequisites

- A Vercel account (https://vercel.com)
- `vercel` CLI installed (optional, but recommended)

## Option 1: Using Vercel CLI (Recommended)

1.  **Install Vercel CLI** (if not already installed):

    ```bash
    npm i -g vercel
    ```

2.  **Login to Vercel**:

    ```bash
    vercel login
    ```

3.  **Deploy**:
    Run the following command in your project root:

    ```bash
    vercel
    ```

4.  **Follow the prompts**:

    - Set up and deploy? **Y**
    - Which scope? (Select your account)
    - Link to existing project? **N**
    - Project name? (Press Enter or type a name)
    - In which directory is your code located? **./**
    - Auto-detect project settings? **Y** (It should detect Vite)

5.  **Production Deployment**:
    Once you are happy with the preview, deploy to production:
    ```bash
    vercel --prod
    ```

## Option 2: Using GitHub Integration

1.  **Push your code to GitHub**.
2.  Go to the **Vercel Dashboard**.
3.  Click **"Add New..."** -> **"Project"**.
4.  Import your GitHub repository.
5.  Vercel will automatically detect the Vite framework and build settings.
6.  Click **"Deploy"**.

## Build Settings (Reference)

If you need to configure manually:

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
