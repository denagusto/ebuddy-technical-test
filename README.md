
# 🚀 Turborepo Monorepo Setup (Frontend + Backend)

This is a **monorepo setup** using **Turborepo** for managing both the **Frontend (Next.js)** and **Backend (Firebase Functions + Firestore)**.

---

## **📌 Prerequisites**
Ensure you have the following installed:
- **Node.js** (Latest LTS recommended)
- **pnpm** (Package manager)
- **Firebase CLI** (For backend emulators)

To install `pnpm`, run:
```sh
npm install -g pnpm

To install the **Firebase CLI**, run:
sh npm install -g firebase-tools
```

---

## **📦 Install Dependencies**
First, install all dependencies for the monorepo:
```sh
pnpm install
```

---

## **🚀 Running the Backend**
To start the Firebase emulators and run the backend:
```sh
cd apps/backend
firebase emulators:start --only firestore,auth
cd ./ 
pnpm --filter backend dev
```

---

## **🎨 Running the Frontend**
To start the Next.js frontend:
```sh
pnpm --filter frontend dev
```

---

## **🛠 Running Everything Together**
You can run both frontend and backend together using **Turborepo**:
```sh
turbo dev
```

---

## **📂 Monorepo Structure**
```
my-monorepo/
│── apps/
│   ├── frontend/   # (Next.js app)
│   ├── backend/    # (Firebase Functions API)
│── packages/
│   ├── shared/     # (Shared utilities & types)
│── turbo.json
│── package.json
│── tsconfig.json
│── .gitignore
```
