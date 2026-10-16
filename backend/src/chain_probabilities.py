"""Predict probabilities from a fitted binary ClassifierChain.

Calling ClassifierChain.predict_proba can fail with some XGBoost/scikit-learn
version combinations because scikit-learn misidentifies XGBClassifier's tags.
The individual fitted estimators can still produce probabilities directly.
"""

import numpy as np


def predict_chain_probabilities(model, X):
    """Return an (n_samples, n_labels) matrix in the original target order."""
    X_aug = np.asarray(X)
    if X_aug.ndim != 2:
        raise ValueError("X must be a two-dimensional feature matrix")

    n_labels = len(model.estimators_)
    probabilities = np.empty((X_aug.shape[0], n_labels), dtype=float)
    order = np.asarray(model.order_)

    for chain_position, estimator in enumerate(model.estimators_):
        classes = np.asarray(estimator.classes_)
        positive = np.flatnonzero(classes == 1)
        if len(positive) != 1:
            raise ValueError("Each chain estimator must have a positive class labeled 1")
        estimator_probabilities = estimator.predict_proba(X_aug)
        probabilities[:, order[chain_position]] = estimator_probabilities[:, positive[0]]

        # ClassifierChain was fitted with chain_method='predict' (the default).
        # Its next estimator receives the preceding hard prediction as a feature.
        if chain_position < n_labels - 1:
            predictions = np.asarray(estimator.predict(X_aug)).reshape(-1, 1)
            X_aug = np.column_stack((X_aug, predictions))

    return probabilities
