import streamlit as st
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

# ==========================================
# PAGE CONFIGURATION
# ==========================================
st.set_page_config(
    page_title="Executive Performance Dashboard",
    page_icon="📈",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Function to load CSS from an external file
def load_css(file_name):
    with open(file_name) as f:
        st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html=True)

# Call the function to load custom CSS
load_css("style.css")

# ==========================================
# HELPER FUNCTIONS
# ==========================================
def format_rupiah(amount):
    # Format amount as Rupiah, e.g., Rp 1.500.000
    return f"Rp {amount:,.0f}".replace(',', 'X').replace('.', ',').replace('X', '.')

# ==========================================
# DATA GENERATION (MOCK DATA)
# ==========================================

# Different base seeds for different brands to ensure data is distinct but reproducible
BRAND_SEEDS = {
    "Brand A": 42,
    "Brand B": 101,
    "Brand C": 999,
    "Brand D": 55,
    "Semua Merek": 123
}

@st.cache_data
def generate_mock_data(brand_name):
    # Set seed based on brand so changing the sidebar updates the data consistently
    current_seed = BRAND_SEEDS.get(brand_name, 0)
    np.random.seed(current_seed)
    
    # 1. Monthly Revenue & Profit Data (Last 12 Months)
    months = pd.date_range(end=datetime.today(), periods=12, freq='ME').strftime('%b %Y')
    
    # "Semua Merek" has significantly higher numbers (aggregate simulation)
    multiplier = 5 if brand_name == "Semua Merek" else 1
    
    # Generate revenue in Rupiah (e.g., 500 Juta - 5 Miliar)
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
        'Nilai Transaksi': np.random.uniform(500_000, 5_000_000, n_rows),  # Retail-sized transactions
        'Status': np.random.choice(statuses, n_rows, p=[0.7, 0.2, 0.1]),
        'SLA': np.random.randint(1, 5, n_rows) # Day delivery
    }).sort_values('Tanggal', ascending=False).reset_index(drop=True)
    
    df_transactions['Tanggal'] = df_transactions['Tanggal'].dt.strftime('%Y-%m-%d')
    return df_financials, df_regions, df_transactions


# ==========================================
# SIDEBAR NAVIGATION & FILTERS
# ==========================================
with st.sidebar:
    st.image("https://cdn-icons-png.flaticon.com/512/3592/3592606.png", width=60)
    st.title("Manajemen Eksekutif")
    st.markdown("---")
    
    st.subheader("Filter Portofolio Merek")
    # Brand Selector
    brands = list(BRAND_SEEDS.keys())
    selected_brand = st.selectbox("Pilih Merek Kendali", brands, index=len(brands)-1)
    
    # Load data dynamically based on the selected brand
    df_fin, df_reg, df_trx = generate_mock_data(selected_brand)
    
    st.markdown("---")
    st.subheader("Filter Data")
    selected_quarter = st.selectbox("Rentang Waktu", ["Kuartal Terakhir", "6 Bulan Terakhir", "12 Bulan Terakhir"], index=2)
    selected_region = st.multiselect("Pilih Wilayah Terkait", df_reg['Wilayah'].tolist(), default=df_reg['Wilayah'].tolist())
    
    st.markdown("---")
    st.markdown("🗓️ **Terakhir Diperbarui:**")
    st.markdown(f"*{datetime.now().strftime('%d %B %Y, %H:%M:%S WIB')}*")

# ==========================================
# MAIN DASHBOARD AREA
# ==========================================

st.title(f"Ringkasan Kinerja Eksekutif: {selected_brand}")
st.markdown(f"Tinjauan komprehensif metrik keuangan dan retail untuk portofolio **{selected_brand}**.")

# --- KPIs SECTION ---
st.markdown(f"### 📊 Indikator Kinerja Utama (KPI) - {selected_brand}")
col1, col2, col3, col4 = st.columns(4)

current_revenue = df_fin['Pendapatan (IDR)'].iloc[-1]
prev_revenue = df_fin['Pendapatan (IDR)'].iloc[-2]
rev_growth = ((current_revenue - prev_revenue) / prev_revenue) * 100

current_profit = df_fin['Laba Bersih (IDR)'].iloc[-1]
prev_profit = df_fin['Laba Bersih (IDR)'].iloc[-2]
prof_growth = ((current_profit - prev_profit) / prev_profit) * 100

total_transactions = len(df_trx)
sla_avg = df_trx['SLA'].mean()

with col1:
    # Use Milestones (Miliar) for better readability
    st.metric(
        label="Pendapatan Bulanan", 
        value=f"Rp {current_revenue/1e9:.2f} M", 
        delta=f"{rev_growth:.1f}% dari bulan lalu"
    )

with col2:
    st.metric(
        label="Laba Bersih Bulanan", 
        value=f"Rp {current_profit/1e9:.2f} M", 
        delta=f"{prof_growth:.1f}% dari bulan lalu"
    )

with col3:
    st.metric(
        label="Total Transaksi (Volume)", 
        value=f"{total_transactions:,}", 
        delta="15% YoY",
        delta_color="normal"
    )

with col4:
    st.metric(
        label="Rata-rata Waktu Proses (SLA)", 
        value=f"{sla_avg:.1f} Hari", 
        delta="-0.2 Hari"
    )

st.divider()

# --- CHARTS SECTION ---
st.markdown("### 📈 Tren Keuangan & Penjualan Ritel")
chart_col1, chart_col2 = st.columns([2, 1])

with chart_col1:
    st.markdown("**Tren Pendapatan & Laba Ritel (12 Bulan Terakhir)**")
    # Prepare data for line chart
    df_chart = df_fin.set_index('Bulan')[['Pendapatan (IDR)', 'Laba Bersih (IDR)']]
    st.line_chart(df_chart, use_container_width=True)

with chart_col2:
    st.markdown(f"**Distribusi Penjualan {selected_brand}**")
    # Prepare data for bar chart
    df_bar = df_reg.set_index('Wilayah')
    st.bar_chart(df_bar, use_container_width=True)

# --- RECENT TRANSACTIONS TABLE ---
st.markdown("### 📋 Detail Transaksi Toko / Cabang Terkini")
st.markdown("Sampel acak aktivitas transaksi ritel terbaru.")

# Format amount column for better readability
df_display = df_trx.copy()
df_display['Nilai Transaksi'] = df_display['Nilai Transaksi'].apply(format_rupiah)

# Display dataframe with Streamlit native styler
st.dataframe(
    df_display.head(15),
    use_container_width=True,
    hide_index=True
)

st.caption("Rahasia & Milik Perusahaan. Hanya untuk Penggunaan Manajemen Internal Tingkat Eksekutif.")
