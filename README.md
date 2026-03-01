# Modern Executive Dashboard

A sleek, interactive, and high-performance web dashboard application rebuilt from the ground up using a modern tech stack. The frontend is powered by **Next.js** for a responsive and robust user interface, while the backend is driven by **FastAPI** to serve complex mock data securely and efficiently.

## Tech Stack

- **Frontend:** Next.js (React), Tailwind CSS, Recharts, Lucide Icons
- **Backend:** FastAPI (Python), Uvicorn
- **Language:** TypeScript & Python

## Features

- **Modern aesthetic UI**: A clean, white-themed executive dashboard inspired by modern web design standards (glassmorphism touches, sparklines, clean typography).
- **Responsive Layout**: Completely responsive sidebar and main content area.
- **Interactive Visualizations**: Includes Area charts, Bar charts, and Sparklines powered by `recharts`.
- **FastAPI Backend**: Rapid data serving for KPIs and transaction mock data.

## Prerequisites

Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v16+)
- [Python](https://www.python.org/downloads/) (3.8+)
- `pip` (Python package installer)

---

## Installation & Local Setup

The project is structured into two main directories: `frontend` (Next.js) and `backend` (FastAPI).

### 1. Setting up the Backend (FastAPI)

Open a terminal and navigate to the backend directory:
```bash
cd backend
```

Create a virtual environment and activate it:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
```

Install backend dependencies:
```bash
pip install -r requirements.txt
```

Run the FastAPI server:
```bash
uvicorn main:app --reload --port 8000
```
*The API will be available at `http://localhost:8000`.*

### 2. Setting up the Frontend (Next.js)

Open a **new** terminal window and navigate to the frontend directory:
```bash
cd frontend
```

Install frontend dependencies:
```bash
npm install
# or
yarn install
```

Run the development server:
```bash
npm run dev
```

*The dashboard will launch and be accessible at `http://localhost:3000`.*

---

## Project Structure

```text
dashboard/
├── backend/                  # FastAPI Application
│   ├── main.py               # Main API endpoints & Mock Data
│   └── requirements.txt      # Python dependencies
├── frontend/                 # Next.js Application
│   ├── src/
│   │   ├── app/              # Next.js App Router (pages & global css)
│   │   ├── components/       # UI Components (Dashboard.tsx)
│   │   └── lib/              # Utilities (Tailwind class merger)
│   ├── tailwind.config.ts    # Tailwind configuration
│   └── package.json          # Node dependencies
└── README.md                 # Project documentation
```

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page if you want to contribute.