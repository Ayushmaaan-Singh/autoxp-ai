import pandas as pd
import numpy as np
import joblib
import re
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import r2_score, mean_squared_error, mean_absolute_error

print("Loading 'Car details v3.csv'...")
df = pd.read_csv('Car details v3.csv')

# Drop rows missing essential numerical target/feature data
df = df.dropna(subset=['selling_price', 'year', 'km_driven', 'mileage', 'engine', 'max_power'])

# 1. Calculate vehicle_age (Reference year set to 2020 based on dataset scrape date)
df['vehicle_age'] = 2020 - df['year']
df['vehicle_age'] = df['vehicle_age'].clip(lower=1.0)

# 2. Extract numeric values from strings (e.g., '19.7 kmpl' -> 19.7, '796 CC' -> 796.0, '46.3 bhp' -> 46.3)
def extract_float(val):
    if pd.isna(val):
        return np.nan
    match = re.search(r'([\d\.]+)', str(val))
    return float(match.group(1)) if match else np.nan

for col in ['mileage', 'engine', 'max_power']:
    df[col] = df[col].apply(extract_float)

df = df.dropna(subset=['mileage', 'engine', 'max_power'])

# 3. Feature Extraction from 'name' (Brand, Model, and Trim Variant)
df['brand'] = df['name'].apply(lambda x: str(x).split()[0])
df['model'] = df['name'].apply(lambda x: str(x).split()[1] if len(str(x).split()) > 1 else 'Other')

# Keep top models and variants with >= 10 occurrences to eliminate noise
frequent_models = df['model'].value_counts()[df['model'].value_counts() >= 10].index
df['model'] = df['model'].apply(lambda m: m if m in frequent_models else 'Other')

# 4. Engineered Interaction Features
df['km_per_year'] = df['km_driven'] / df['vehicle_age']
df['power_to_engine'] = df['max_power'] / np.maximum(df['engine'], 1.0)

numeric_features = [
    'vehicle_age', 'km_driven', 'mileage', 'engine', 
    'max_power', 'seats', 'km_per_year', 'power_to_engine'
]

categorical_features = [
    'brand', 'model', 'seller_type', 'fuel', 'transmission', 'owner'
]

X = df[numeric_features + categorical_features]
y = df['selling_price']

# Log-transform target variable to handle right-skewed pricing distributions
y_log = np.log1p(y)

preprocessor = ColumnTransformer(
    transformers=[
        ('num', StandardScaler(), numeric_features),
        ('cat', OneHotEncoder(handle_unknown='ignore', drop='first'), categorical_features)
    ]
)

rf_model = RandomForestRegressor(
    n_estimators=200,
    max_depth=22,
    min_samples_split=3,
    random_state=42,
    n_jobs=-1
)

pipeline = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('model', rf_model)
])

X_train, X_test, y_train, y_test = train_test_split(X, y_log, test_size=0.2, random_state=42)

print("Training Random Forest Regressor on v3 dataset...")
pipeline.fit(X_train, y_train)

# Model Evaluation
y_pred_log = pipeline.predict(X_test)
y_pred = np.expm1(y_pred_log)
y_test_actual = np.expm1(y_test)

r2 = r2_score(y_test_actual, y_pred)
rmse = np.sqrt(mean_squared_error(y_test_actual, y_pred))
mae = mean_absolute_error(y_test_actual, y_pred)

print("\n--- Model Performance (Car Details v3) ---")
print(f"R² Score:            {r2:.4f}")
print(f"RMSE:                ₹{rmse:,.2f}")
print(f"Mean Absolute Error: ₹{mae:,.2f}")

joblib.dump(pipeline, 'car_price_pipeline.joblib')
print("\nModel pipeline saved successfully as 'car_price_pipeline.joblib'!")