import unittest
from unittest.mock import call, patch

from pydantic_ai import ModelConnectionError, ModelQuotaExceededError

from app.ai.retry import run_with_model_retries


class ModelRetryTests(unittest.TestCase):
    @patch("app.ai.retry.time.sleep")
    def test_retries_connection_errors_then_returns_result(self, sleep: unittest.mock.Mock) -> None:
        connection_error = ModelConnectionError("test-model", "Connection error")
        model_call = unittest.mock.Mock(
            side_effect=[connection_error, connection_error, "success"]
        )

        result = run_with_model_retries("test operation", model_call)

        self.assertEqual(result, "success")
        self.assertEqual(model_call.call_count, 3)
        self.assertEqual(sleep.call_args_list, [call(1), call(2)])

    @patch("app.ai.retry.time.sleep")
    def test_does_not_retry_exhausted_quota(
        self, sleep: unittest.mock.Mock
    ) -> None:
        quota_error = ModelQuotaExceededError("test-model", "Quota exhausted")
        model_call = unittest.mock.Mock(side_effect=quota_error)

        with self.assertRaises(ModelQuotaExceededError):
            run_with_model_retries("test operation", model_call)

        model_call.assert_called_once()
        sleep.assert_not_called()


if __name__ == "__main__":
    unittest.main()
