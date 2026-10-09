# 🚀 5-Minute Production Deployment Guide

Follow these simple steps to deploy your application to Render using the pre-configured production files.

## 📋 Prerequisites
1. A **GitHub** Account
2. A **Render** Account (Free tier works perfectly)

---

## ⚡ Direct Deployment (Under 5 Minutes)

### Step 1: Push code to GitHub
Create a new GitHub repository and push your project structure including the new config files:
```bash
git init
git add .
git commit -m "feat: configure files for render production"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### Step 2: Deploy to Render
1. Log in to your [Render Dashboard](https://dashboard.render.com).
2. Click **Blueprints** on the top navigation bar.
3. Click **New Blueprint Instance**.
4. Connect your GitHub account and choose the repository you just pushed.
5. Review the resources (`islm-production-app` and `islm-mongodb`).
6. Click **Approve**. Render will automatically provision your database and build the container using the multi-stage `Dockerfile`.

---

## 🔒 Setup Automated CI/CD (Optional)
To trigger automated rolling deployments on every git push:
1. Go to your Web Service dashboard on Render, copy the **Service ID** (under settings) and generate an **API Key** in your Account Settings.
2. In your GitHub repository, navigate to **Settings -> Secrets and variables -> Actions**.
3. Create two repository secrets:
   * `RENDER_SERVICE_ID` - Paste your Web Service ID.
   * `RENDER_API_KEY` - Paste your Render Account API Key.

---

## 🛠️ Local Development (Using Docker Compose)
To run the full stack locally with matching production configurations, run:
```bash
docker-compose up --build