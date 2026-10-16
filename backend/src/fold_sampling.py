"""Training-only oversampling for multilabel cross-validation.

The validation fold is never passed to the sampler. This sampler preserves the
project's existing strategy of balancing the all-zero label combination.
"""

import numpy as np
import pandas as pd
from sklearn.base import clone
from sklearn.metrics import f1_score
from sklearn.neighbors import NearestNeighbors


TARGET_COLUMNS = ("risk_depression", "risk_anxiety", "risk_stress")


def oversample_training(X: pd.DataFrame, y: pd.DataFrame, random_state: int = 42):
    """Balance all-zero versus other label combinations using training rows only."""
    X = X.reset_index(drop=True)
    y = y.reset_index(drop=True)
    minority_mask = y[list(TARGET_COLUMNS)].eq(0).all(axis=1)
    X_minority, y_minority = X.loc[minority_mask], y.loc[minority_mask]
    minority_count = len(X_minority)
    majority_count = len(X) - minority_count
    n_synthetic = majority_count - minority_count

    if n_synthetic <= 0:
        return X, y
    if minority_count < 2:
        raise ValueError("At least two all-zero training rows are needed for oversampling")

    minority_values = X_minority.to_numpy(dtype=float)
    neighbors = NearestNeighbors(n_neighbors=min(5, minority_count))
    neighbors.fit(minority_values)
    rng = np.random.default_rng(random_state)
    synthetic_values = np.empty((n_synthetic, X.shape[1]), dtype=float)

    for i in range(n_synthetic):
        source = rng.integers(minority_count)
        neighbor_indices = neighbors.kneighbors(
            minority_values[source : source + 1], return_distance=False
        )[0]
        neighbor_indices = neighbor_indices[neighbor_indices != source]
        neighbor = rng.choice(neighbor_indices)
        step = rng.uniform(0, 1)
        synthetic_values[i] = minority_values[source] + step * (
            minority_values[neighbor] - minority_values[source]
        )

    X_synthetic = pd.DataFrame(synthetic_values, columns=X.columns)
    y_synthetic = pd.DataFrame(
        np.zeros((n_synthetic, y.shape[1]), dtype=int), columns=y.columns
    )
    X_balanced = pd.concat([X, X_synthetic], ignore_index=True)
    y_balanced = pd.concat([y, y_synthetic], ignore_index=True)
    return X_balanced, y_balanced


def cross_validate_with_fold_sampling(model, X, y, cv, random_state: int = 42):
    """Return macro F1 scores with oversampling confined to each training fold."""
    if not isinstance(X, pd.DataFrame) or not isinstance(y, pd.DataFrame):
        raise TypeError("X and y must be pandas DataFrames")

    scores = []
    for fold, (train_idx, validation_idx) in enumerate(cv.split(X, y)):
        X_fit, y_fit = oversample_training(
            X.iloc[train_idx], y.iloc[train_idx], random_state=random_state + fold
        )
        fitted = clone(model).fit(X_fit, y_fit)
        predictions = fitted.predict(X.iloc[validation_idx])
        scores.append(
            f1_score(y.iloc[validation_idx], predictions, average="macro", zero_division=0)
        )

    return {"test_score": np.asarray(scores)}
