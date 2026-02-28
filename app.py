import streamlit as st

st.set_page_config(
    page_title="My Streamlit App",
    layout="wide"
)

st.title("Hello Streamlit!")

st.write("Welcome to your new Streamlit project. You can edit `app.py` to change this page.")

st.sidebar.header("Configuration")
st.sidebar.write("Put your settings here.")
