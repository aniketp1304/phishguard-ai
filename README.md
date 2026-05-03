# PhishGuard AI

**PhishGuard AI** is a professional-grade, full-stack phishing detection system. It analyzes URLs using multiple heuristic signals to calculate a real-time risk score, detecting potentially malicious websites before users interact with them. 

This project is built with a Node.js (Express) backend and a modern React (Next.js) frontend, featuring a sleek, dark-themed UI.

---

## 🚀 Features

- **Advanced URL Scanner:** Detects suspicious keywords, URL length anomalies, IP-based domains, excessive subdomains, brand impersonation, and more.
- **Risk Scoring System:** Assigns a score from 0–100 and classifies URLs into `SAFE`, `SUSPICIOUS`, or `PHISHING`.
- **Real-Time Dashboard:** Visualizes scan statistics with interactive Recharts (Line and Pie charts).
- **Scan History Logs:** Paginated table to review past scan verdicts and scores.
- **Security Tools Suite:**
  - Password Strength Checker
  - Email Phishing Keyword Analysis
  - Domain WHOIS Viewer (Mock implementation)
  - IP Inspector (Mock implementation)
- **Modern UI/UX:** Responsive design, glassmorphism aesthetics, Tailwind CSS, and Framer Motion animations.

---

## 📂 Project Structure

```
phishguard-ai/
├── backend/                  # Node.js API server
│   ├── src/
│   │   ├── data/             # In-memory store (Logs & Stats)
│   │   ├── engine/           # Phishing detection heuristic logic
│   │   ├── routes/           # Express API endpoints
│   │   └── index.js          # Entry point
│   └── package.json
├── frontend/                 # Next.js web application
│   ├── src/
│   │   ├── app/              # Next.js App Router (Pages & Layout)
│   │   ├── components/       # Reusable UI components (Sidebar)
│   │   └── lib/              # Axios API client
│   ├── public/
│   ├── package.json
│   └── tailwind.config.ts
└── README.md
```

---

## ⚙️ Local Development Setup

To run this application locally without Docker, follow these steps.

### 1. Start the Backend
```bash
cd backend
npm install
npm run start
# Server runs on http://localhost:5000
```
*(Note: Ensure you add a `"start": "node src/index.js"` script to `backend/package.json` if not already present)*

### 2. Start the Frontend
```bash
cd frontend
npm install
npm run dev
# Web app runs on http://localhost:3000
```

---

## 🛠️ DevOps Integration (Coming Soon)

This section will be populated in Phase 2 of the project, covering:
- **Docker & Docker Compose** for containerization
- **Jenkins CI/CD Pipeline** for automated testing and deployment
- **Prometheus & Grafana** for application monitoring

---

## 📝 Future Enhancements

- Integrate MongoDB for persistent log storage.
- Enhance detection engine with Machine Learning models (Python microservice).
- Implement real WHOIS and IP lookup external APIs.

---
*Developed for academic review and portfolio demonstration.*
