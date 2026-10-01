# JBN Cakes - Full-Stack Deployment & Developer Guide 🍰

This project is structured for seamless production deployment and local development:
- **Frontend**: React + Vite (Configured for **Vercel** deployment)
- **Backend**: Spring Boot REST API (Configured with **Dockerfile** for **Render** deployment)
- **Database**: **TiDB Cloud** (MySQL Compatible)
- **Tooling**: Fully compatible with **VS Code**, **Eclipse**, and **MySQL Workbench**.

---

## 🔑 Configured TiDB Cloud Database Credentials

| Parameter | Value |
| :--- | :--- |
| **Host** | `gateway01.ap-southeast-1.prod.aws.tidbcloud.com` |
| **Port** | `4000` |
| **Username** | `4CkbKxxcPYFnkGE.root` |
| **Password** | `R42vxlufciPReqDb` |
| **Database Name** | `login_app` |
| **JDBC URL** | `jdbc:mysql://gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/login_app?createDatabaseIfNotExist=true&useSSL=true&enabledTLSProtocols=TLSv1.2,TLSv1.3&serverTimezone=UTC` |

---

## 🚀 Quick Deployment Guide

### 1️⃣ Backend Deployment on Render (via Docker)
1. Push this repository to GitHub/GitLab.
2. Log in to [Render Dashboard](https://dashboard.render.com/).
3. Click **New +** -> **Web Service**.
4. Connect your repository.
5. Set Root Directory to: `backend`
6. Select Environment: **Docker** (Render automatically detects `backend/Dockerfile`).
7. Add the following **Environment Variables** in Render:

| Variable | Value |
| :--- | :--- |
| `SPRING_DATASOURCE_URL` | `jdbc:mysql://gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/login_app?createDatabaseIfNotExist=true&useSSL=true&enabledTLSProtocols=TLSv1.2,TLSv1.3&serverTimezone=UTC` |
| `SPRING_DATASOURCE_USERNAME` | `4CkbKxxcPYFnkGE.root` |
| `SPRING_DATASOURCE_PASSWORD` | `R42vxlufciPReqDb` |
| `JWT_SECRET` | `404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970` |
| `ALLOWED_ORIGINS` | `https://your-vercel-app.vercel.app,http://localhost:5173` |

8. Health Check Endpoint on Render: `/api/health`
9. Click **Create Web Service**.

---

### 2️⃣ Frontend Deployment on Vercel
1. Log in to [Vercel](https://vercel.com/).
2. Click **Add New** -> **Project** and import your GitHub repository.
3. Set Framework Preset: **Vite**.
4. Set Root Directory to: `frontend`
5. Add Environment Variable:
   - `VITE_API_URL`: `https://<your-render-backend-url>.onrender.com/api`
6. Click **Deploy**.
7. `frontend/vercel.json` will automatically route client routes (`/login`, `/signup`, `/customer/dashboard`, `/admin/dashboard`, `/cart`) safely without 404 errors.

---

## 🛠️ Tooling & IDE Integration

### 💻 Using VS Code
- Open workspace folder: `jbnCakes-main (1)`
- Run Frontend:
  ```bash
  cd frontend
  npm run dev
  ```
- Run Backend:
  ```bash
  cd backend
  mvn spring-boot:run
  ```

### ☕ Using Eclipse IDE
1. Open Eclipse -> **File** -> **Import...** -> **Existing Maven Projects**.
2. Select the `backend` folder.
3. Right-click `JbnCakesBackendApplication.java` -> **Run As** -> **Java Application**.

### 🐬 Using MySQL Workbench
1. Open MySQL Workbench -> **New Connection**.
2. Hostname: `gateway01.ap-southeast-1.prod.aws.tidbcloud.com`
3. Port: `4000`
4. Default Schema: `login_app`
5. Username: `4CkbKxxcPYFnkGE.root`
6. Password: `R42vxlufciPReqDb`
7. SSL tab: Select **Use SSL (Require SSL)**.
8. Click **Test Connection** & **OK**.

---

## 🔑 Default Seed Accounts

| Account Type | Email | Password | Role |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@jbncakes.com` | `admin123` | `ADMIN` |
| **Customer** | `customer@jbncakes.com` | `customer123` | `CUSTOMER` |

---

## 🏥 Health Monitoring Endpoint
- Endpoint: `GET /api/health`
- Response Example:
  ```json
  {
    "status": "UP",
    "service": "JBN Cakes Backend",
    "database": "CONNECTED (TiDB/MySQL)",
    "timestamp": "2026-10-01T12:30:00"
  }
  ```
