from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

app = FastAPI(title="Executive Performance Dashboard API")

# Setup CORS to allow Next.js frontend to access the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins for dev
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

def generate_mock_data(brand_name: str):
    current_seed = BRAND_SEEDS.get(brand_name, 0)
    np.random.seed(current_seed)
    
    # 1. Monthly Revenue & Profit Data (Last 12 Months)
    months = pd.date_range(end=datetime.today(), periods=12, freq='ME').strftime('%b %Y')
    
    multiplier = 5 if brand_name == "Semua Merek" else 1
    
    revenue = np.random.uniform(500_000_000 * multiplier, 5_000_000_000 * multiplier, 12)
    profit = revenue * np.random.uniform(0.15, 0.35, 12)
    
    df_financials = pd.DataFrame({
        'Bulan': months,
        'Pendapatan (IDR)': revenue,
        'Laba Bersih (IDR)': profit
    })
    
    # 2. Regional Performance
    regions = ['Jawa', 'Sumatera', 'Kalimantan', 'Sulawesi', 'Bali & Nusa Tenggara', 'Papua & Maluku']
    sales_by_region = np.random.randint(1000 * multiplier, 5000 * multiplier, len(regions))
    
    df_regions = pd.DataFrame({
        'Wilayah': regions,
        'Volume Penjualan': sales_by_region
    })
    
    # 3. Detailed Transactional Data
    n_rows = 150 if brand_name == "Semua Merek" else np.random.randint(50, 100)
    dates = [datetime.today() - timedelta(days=np.random.randint(0, 90)) for _ in range(n_rows)]
    products = ['Item Reguler', 'Item Premium', 'Item Eksklusif', 'Aksesoris Tambahan']
    statuses = ['Selesai', 'Pending', 'Diproses']
    
    df_transactions = pd.DataFrame({
        'Tanggal': dates,
        'ID Transaksi': ['TRX-' + str(np.random.randint(10000, 99999)) for _ in range(n_rows)],
        'Kategori Produk': np.random.choice(products, n_rows),
        'Nilai Transaksi': np.random.uniform(500_000, 5_000_000, n_rows),
        'Status': np.random.choice(statuses, n_rows, p=[0.7, 0.2, 0.1]),
        'SLA': np.random.randint(1, 5, n_rows) # Day delivery
    }).sort_values('Tanggal', ascending=False).reset_index(drop=True)
    
    df_transactions['Tanggal'] = df_transactions['Tanggal'].dt.strftime('%Y-%m-%d')
    return df_financials, df_regions, df_transactions

@app.get("/api/dashboard")
def get_dashboard_data(brand: str = Query("Semua Merek", description="The brand name to fetch data for")):
    if brand not in BRAND_SEEDS:
        brand = "Semua Merek"
        
    df_fin, df_reg, df_trx = generate_mock_data(brand)
    
    # Helper to convert dataframe to list of dicts safely with NaN replaced by None
    def df_to_dict(df):
        return df.replace({np.nan: None}).to_dict(orient='records')
        
    financials = df_to_dict(df_fin)
    regions = df_to_dict(df_reg)
    transactions = df_to_dict(df_trx)
    
    # Calculate KPIs
    current_revenue = float(financials[-1]['Pendapatan (IDR)']) if len(financials) > 0 else 0
    prev_revenue = float(financials[-2]['Pendapatan (IDR)']) if len(financials) > 1 else 0
    rev_growth = ((current_revenue - prev_revenue) / prev_revenue) * 100 if prev_revenue > 0 else 0

    current_profit = float(financials[-1]['Laba Bersih (IDR)']) if len(financials) > 0 else 0
    prev_profit = float(financials[-2]['Laba Bersih (IDR)']) if len(financials) > 1 else 0
    prof_growth = ((current_profit - prev_profit) / prev_profit) * 100 if prev_profit > 0 else 0

    total_transactions = len(transactions)
    sla_avg = float(np.mean([t['SLA'] for t in transactions])) if transactions else 0
    
    kpis = {
        "currentRevenue": current_revenue,
        "revenueGrowth": rev_growth,
        "currentProfit": current_profit,
        "profitGrowth": prof_growth,
        "totalTransactions": total_transactions,
        "slaAvg": sla_avg
    }
    
    return {
        "brand": brand,
        "kpis": kpis,
        "financials": financials,
        "regions": regions,
        "transactions": transactions,
        "availableBrands": list(BRAND_SEEDS.keys())
    }
