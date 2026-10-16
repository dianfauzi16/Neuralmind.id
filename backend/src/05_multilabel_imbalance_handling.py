#!/usr/bin/env python
# coding: utf-8

import pandas as pd
import mlflow
import matplotlib.pyplot as plt
import seaborn as sns
from pathlib import Path
from fold_sampling import oversample_training
import os
from dotenv import load_dotenv
import warnings
warnings.filterwarnings('ignore')

# ==========================================
# 1. SETUP PATH & MLFLOW
# ==========================================
root_path = Path(__file__).resolve().parent.parent
load_dotenv(dotenv_path=root_path / ".env") 
tracking_uri = os.getenv("MLFLOW_TRACKING_URI", (root_path / "mlruns").as_uri())
mlflow.set_tracking_uri(tracking_uri)
mlflow.set_experiment("05_Multi_label_Imbalance")

# Folder output untuk figure
output_dir = root_path / "outputs" / "imbalance_figures"
output_dir.mkdir(parents=True, exist_ok=True)

with mlflow.start_run(run_name="SMOTE_Principle_AllZero_Group_Final_Training"):
    # ==========================================
    # 3. LOAD DATA (Dari Single Split)
    # ==========================================
    print("⏳ 1. Memuat Data Training (Hasil Single Split 80:20)...")
    train_df = pd.read_csv(root_path / "Data/split/train_data.csv")

    target_cols = ['risk_depression', 'risk_anxiety', 'risk_stress']
    X_train = train_df.drop(columns=target_cols)
    Y_train = train_df[target_cols]

    # ==========================================
    # 4. ANALISIS DISTRIBUSI AWAL (SEBELUM)
    # ==========================================
    print("⏳ 2. Menganalisis distribusi kelas awal...")
    minority_mask = (Y_train['risk_depression'] == 0) & (Y_train['risk_anxiety'] == 0) & (Y_train['risk_stress'] == 0)
    majority_mask = ~minority_mask
    minority_count = minority_mask.sum()
    majority_count = majority_mask.sum()

    print(f"   Kelompok (0,0,0)  : {minority_count:,}")
    print(f"   Sedikitnya satu label 1 : {majority_count:,}")
    print(f"   Rasio Imbalance         : 1 : {majority_count/minority_count:.2f}")

    # ==========================================
    # 5. OVERSAMPLING KELOMPOK (0,0,0) UNTUK PELATIHAN AKHIR MODEL POHON
    # Saat tuning, fold_sampling.py membentuk sampel dari bagian pelatihan setiap fold.
    # ==========================================
    print("\n⏳ 3. Menjalankan oversampling berbasis prinsip SMOTE pada kelompok (0,0,0)...")
    n_synthetic = majority_count - minority_count
    print(f"   Akan digenerate {n_synthetic:,} data sintetis...")

    X_train_final, Y_train_final = oversample_training(X_train, Y_train, random_state=42)
    X_res = X_train_final.iloc[len(X_train):]

    # ==========================================
    # 6. SIMPAN DATA HASIL OVERSAMPLING
    # ==========================================
    train_balanced_df = pd.concat([X_train_final, Y_train_final], axis=1)
    output_data_path = root_path / "Data/processed/train_smote.csv" 
    output_data_path.parent.mkdir(parents=True, exist_ok=True)
    train_balanced_df.to_csv(output_data_path, index=False)
    print(f"   ✅ Data hasil oversampling tersimpan di: {output_data_path}")

    # ==========================================
    # 7. VISUALISASI & LOGGING MLFLOW
    # ==========================================
    print("\n⏳ 4. Membuat visualisasi & Logging...")

    sns.set_theme(style="whitegrid")
    
    # --- Plot Individual Label Distribution ---
    
    # Data Before
    indiv_data_before = []
    for col in target_cols:
        aman = (Y_train[col] == 0).sum()
        beresiko = (Y_train[col] == 1).sum()
        indiv_data_before.append({'Kondisi': col.replace('risk_', '').capitalize(), 'Status': 'Normal-ringan (0)', 'Count': aman})
        indiv_data_before.append({'Kondisi': col.replace('risk_', '').capitalize(), 'Status': 'Sedang ke atas (1)', 'Count': beresiko})
    df_indiv_before = pd.DataFrame(indiv_data_before)
    
    # Data After
    indiv_data_after = []
    for col in target_cols:
        aman = (Y_train_final[col] == 0).sum()
        beresiko = (Y_train_final[col] == 1).sum()
        indiv_data_after.append({'Kondisi': col.replace('risk_', '').capitalize(), 'Status': 'Normal-ringan (0)', 'Count': aman})
        indiv_data_after.append({'Kondisi': col.replace('risk_', '').capitalize(), 'Status': 'Sedang ke atas (1)', 'Count': beresiko})
    df_indiv_after = pd.DataFrame(indiv_data_after)
    
    fig_indiv, axes_indiv = plt.subplots(1, 2, figsize=(14, 6))
    
    # Sebelum oversampling
    sns.barplot(data=df_indiv_before, x='Kondisi', y='Count', hue='Status', ax=axes_indiv[0], palette=['#2ecc71', '#e74c3c'])
    axes_indiv[0].set_title("Individual Label Distribution (Before Oversampling)", fontsize=14, fontweight='bold')
    for container in axes_indiv[0].containers:
        axes_indiv[0].bar_label(container, fmt='%d', padding=3, fontweight='bold')
        
    # Sesudah oversampling
    sns.barplot(data=df_indiv_after, x='Kondisi', y='Count', hue='Status', ax=axes_indiv[1], palette=['#2ecc71', '#e74c3c'])
    axes_indiv[1].set_title("Individual Label Distribution (After Oversampling)", fontsize=14, fontweight='bold')
    for container in axes_indiv[1].containers:
        axes_indiv[1].bar_label(container, fmt='%d', padding=3, fontweight='bold')
        
    plt.tight_layout()
    fig_indiv_path = output_dir / "individual_labels_distribution.png"
    plt.savefig(fig_indiv_path, dpi=300, bbox_inches='tight')
    plt.show()
    plt.close()
    mlflow.log_artifact(str(fig_indiv_path))
    print(f"   ✅ Saved: {fig_indiv_path.name}")
    
    # --- Plot Combined Label Patterns ---
    fig_comb, axes_comb = plt.subplots(2, 1, figsize=(14, 12))
    
    # Sebelum oversampling
    y_str_before = Y_train.apply(lambda row: f"{int(row['risk_depression'])}{int(row['risk_anxiety'])}{int(row['risk_stress'])}", axis=1)
    combined_counts_before = y_str_before.value_counts()
    
    sns.barplot(x=combined_counts_before.index, y=combined_counts_before.values, ax=axes_comb[0], palette="Oranges_d")
    axes_comb[0].set_title("Combined Label Patterns (Before Oversampling)", fontsize=14, fontweight='bold')
    axes_comb[0].set_ylabel("Count")
    axes_comb[0].set_xlabel("Pattern (Depression, Anxiety, Stress)")
    for i, v in enumerate(combined_counts_before.values):
        axes_comb[0].text(i, v + max(combined_counts_before.values)*0.01, str(v), ha='center', fontweight='bold')

    # Sesudah oversampling
    y_str_after = Y_train_final.apply(lambda row: f"{int(row['risk_depression'])}{int(row['risk_anxiety'])}{int(row['risk_stress'])}", axis=1)
    combined_counts_after = y_str_after.value_counts()
    
    sns.barplot(x=combined_counts_after.index, y=combined_counts_after.values, ax=axes_comb[1], palette="Purples_d")
    axes_comb[1].set_title("Combined Label Patterns (After Oversampling)", fontsize=14, fontweight='bold')
    axes_comb[1].set_ylabel("Count")
    axes_comb[1].set_xlabel("Pattern (Depression, Anxiety, Stress)")
    for i, v in enumerate(combined_counts_after.values):
        axes_comb[1].text(i, v + max(combined_counts_after.values)*0.01, str(v), ha='center', fontweight='bold')
        
    plt.tight_layout()
    fig_comb_path = output_dir / "combined_label_patterns.png"
    plt.savefig(fig_comb_path, dpi=300, bbox_inches='tight')
    plt.show()
    plt.close()
    mlflow.log_artifact(str(fig_comb_path))
    print(f"   ✅ Saved: {fig_comb_path.name}")
    
    mlflow.log_param("sampling_strategy", "SMOTE-principle interpolation within the (0,0,0) group")
    mlflow.log_param("target_ratio", "1:1")
    mlflow.log_metric("original_size", len(X_train))
    mlflow.log_metric("final_balanced_size", len(X_train_final))
    mlflow.log_metric("synthetic_generated", len(X_res))

    summary = f"""
### ⚖️ Tahap 05: Multi-label Imbalance Handling Selesai
---
Oversampling berbasis prinsip SMOTE pada kelompok **(0,0,0)** telah diterapkan pada **seluruh data latih (80%)** untuk pelatihan akhir kedua model XGBoost dan Random Forest.
Seluruh sampel asli dipertahankan. Kelompok (0,0,0) diseimbangkan terhadap gabungan kelompok lainnya; frekuensi setiap label maupun seluruh kombinasi label tidak disamakan.
Selama tuning, oversampling dilakukan terpisah pada bagian pelatihan setiap fold. SVM menggunakan data latih asli.

**Ukuran Data:**
* Jumlah Data Awal     : **{len(X_train):,}** baris
* Jumlah Data Akhir    : **{len(X_train_final):,}** baris
* Data Sintetis Dibuat : **+{len(X_res):,}** baris

✅ *Dataset hasil oversampling tersimpan di `Data/processed/train_smote.csv`.*
"""
    print(summary)
