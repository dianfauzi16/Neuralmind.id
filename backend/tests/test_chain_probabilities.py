import unittest
import sys
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from src.chain_probabilities import predict_chain_probabilities


class FakeEstimator:
    classes_ = np.array([0, 1])

    def __init__(self, probability, expected_width, prediction):
        self.probability = probability
        self.expected_width = expected_width
        self.prediction = prediction

    def predict_proba(self, X):
        assert X.shape[1] == self.expected_width
        return np.tile([1 - self.probability, self.probability], (len(X), 1))

    def predict(self, X):
        assert X.shape[1] == self.expected_width
        return np.full(len(X), self.prediction)


class ChainProbabilityTests(unittest.TestCase):
    def test_restores_target_order_and_augments_chain(self):
        class Chain:
            order_ = np.array([2, 0, 1])
            estimators_ = [
                FakeEstimator(0.7, 2, 1),
                FakeEstimator(0.2, 3, 0),
                FakeEstimator(0.9, 4, 1),
            ]

        X = np.array([[1.0, 2.0], [3.0, 4.0]])
        result = predict_chain_probabilities(Chain(), X)
        np.testing.assert_allclose(result, [[0.2, 0.9, 0.7], [0.2, 0.9, 0.7]])


if __name__ == "__main__":
    unittest.main()
