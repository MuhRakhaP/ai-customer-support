import logging
import time
from collections.abc import Callable
from typing import TypeVar

from pydantic_ai import (
    ModelConnectionError,
    ModelRateLimitError,
    ModelServerError,
    ModelUnavailableError,
)

logger = logging.getLogger(__name__)
T = TypeVar("T")
TRANSIENT_MODEL_ERRORS = (
    ModelConnectionError,
    ModelRateLimitError,
    ModelServerError,
    ModelUnavailableError,
)
MAX_MODEL_RETRIES = 2
MAX_RETRY_DELAY_SECONDS = 30


def run_with_model_retries(operation: str, call: Callable[[], T]) -> T:
    """Retry transient provider failures; let permanent API errors fail immediately."""
    for attempt in range(1, MAX_MODEL_RETRIES + 2):
        try:
            return call()
        except TRANSIENT_MODEL_ERRORS as error:
            if attempt > MAX_MODEL_RETRIES:
                logger.exception("Model operation %s failed after %s attempts", operation, attempt)
                raise

            delay = min(
                error.retry_after or 2 ** (attempt - 1),
                MAX_RETRY_DELAY_SECONDS,
            )
            logger.warning(
                "Transient model error during %s (attempt %s/%s); retrying in %.1f seconds: %s",
                operation,
                attempt,
                MAX_MODEL_RETRIES + 1,
                delay,
                error,
            )
            time.sleep(delay)

    raise AssertionError("unreachable")
