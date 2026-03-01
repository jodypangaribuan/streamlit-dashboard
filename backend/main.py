from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

app = FastAPI(title="Dashboard API")

# Allow CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BRAND_SEEDS = {
    "Brand A": 42,
    "Brand B": 101,
    "Brand C": 999,
    "Brand D": 55,
    "Semua Merek": 123
}

def generate_mock_data(brand_name: str, quarter: str = "12 Bulan Terakhir"):
    current_seed = BRAND_SEEDS.get(brand_name, 0)
    np.random.seed(current_seed)
    
    # 1. Monthly Revenue & Profit
    months_count = 12
    if quarter == "Kuartal Terakhir":
        months_count = 3
    elif quarter == "6 Bulan Terakhir":
        months_count = 6
        
    months = pd.date_range(end=datetime.today(), periods=months_count, freq='ME').strftime('%b %Y')
    multiplier = 5 if brand_name == "Semua Merek" else 1
    
    revenue = np.random.uniform(500_000_000 * multiplier, 5_000_000_000 * multiplier, months_count)
    profit = revenue * np.random.uniform(0.15, 0.35, months_count)
    
    financials = [
        {"Bulan": m, "Pendapatan": float(r), "Laba": float(p)} for m, r, p in zip(months, revenue, profit)
    ]
    
    # 2. Regional
    regions = ['Jawa', 'Sumatera', 'Kalimantan', 'Sulawesi', 'Bali & Nusa Tenggara', 'Papua & Maluku']
    sales_by_region = np.random.randint(1000 * multiplier, 5000 * multiplier, len(regions))
    
    regional_data = [
        {"Wilayah": r, "Volume": int(v)} for r, v in zip(regions, sales_by_region)
    ]
    
    # 3. Transactions
    n_rows = 150 if brand_name == "Semua Merek" else np.random.randint(50, 100)
    dates = [datetime.today() - timedelta(days=np.random.randint(0, 90)) for _ in range(n_rows)]
    products = ['Item Reguler', 'Item Premium', 'Item Eksklusif', 'Aksesoris Tambahan']
    statuses = ['Selesai', 'Pending', 'Diproses']
    
    transactions = []
    for i in range(n_rows):
        transactions.append({
            "Tanggal": dates[i].strftime('%Y-%m-%d'),
            "ID Transaksi": f"TRX-{np.random.randint(10000, 99999)}",
            "Kategori Produk": str(np.random.choice(products)),
            "Nilai Transaksi": float(np.random.uniform(500_000, 5_000_000)),
            "Status": str(np.random.choice(statuses, p=[0.7, 0.2, 0.1])),
            "SLA": int(np.random.randint(1, 5))
        })
    
    transactions.sort(key=lambda x: x["Tanggal"], reverse=True)
    
    return {
        "financials": financials,
        "regions": regional_data,
        "transactions": transactions
    }

@app.get("/api/brands")
def get_brands():
    return {"brands": list(BRAND_SEEDS.keys())}

@app.get("/api/dashboard")
def get_dashboard_data(brand: str = "Semua Merek", quarter: str = "12 Bulan Terakhir"):
    if brand not in BRAND_SEEDS:
        brand = "Semua Merek"
    return generate_mock_data(brand, quarter)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
