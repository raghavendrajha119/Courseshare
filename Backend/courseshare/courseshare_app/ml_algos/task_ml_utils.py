import pandas as pd
import os
import pickle
from sklearn.linear_model import LogisticRegression

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_DIR = os.path.join(BASE_DIR, "model")
os.makedirs(MODEL_DIR, exist_ok=True)
MODEL_PATH = os.path.join(MODEL_DIR, "task_risk_model.pkl")

model = None
feature_cols = None

def train_model(tasks_queryset):
    """Train model from Task queryset."""
    global model, feature_cols
    df = pd.DataFrame(list(tasks_queryset.values()))

    # Only completed tasks
    df = df.dropna(subset=["late_flag"])
    if df.shape[0] < 5:
        return None

    df["late_flag"] = df["late_flag"].astype(int)
    X = pd.get_dummies(df[["task_type", "time_left_in_days", "other_tasks_pending"]])
    y = df["late_flag"]

    feature_cols = X.columns.tolist()
    model = LogisticRegression()
    model.fit(X, y)

    with open(MODEL_PATH, "wb") as f:
        pickle.dump((model, feature_cols), f)

    return model


def load_model():
    """Load model if exists."""
    global model, feature_cols
    if os.path.exists(MODEL_PATH):
        with open(MODEL_PATH, "rb") as f:
            model, feature_cols = pickle.load(f)
        return model
    return None


def predict_risk(task_type, time_left, pending_tasks):
    """Predict if task is at high risk of delay."""
    global model, feature_cols
    if model is None:
        load_model()
    if model is None:
        return None  # Model not trained yet

    row = pd.DataFrame([{
        "task_type": task_type,
        "time_left_in_days": time_left,
        "other_tasks_pending": pending_tasks
    }])
    row = pd.get_dummies(row)
    for col in feature_cols:
        if col not in row:
            row[col] = 0
    row = row[feature_cols]
    return int(model.predict(row)[0])
