"""Domain-level exceptions adhering to Clean Architecture principles.

Isolates domain error conditions from external presentation frameworks.
"""


class DomainException(Exception):
    """Base exception class for all domain-level exceptions."""

    def __init__(self, message: str) -> None:
        """Initializes the exception with a descriptive error message.

        Args:
            message (str): Explanatory error details.
        """
        super().__init__(message)
        self.message = message


class DomainValidationError(DomainException):
    """Raised when an entity invariant or business rule validation fails."""
    pass


class EntityNotFoundException(DomainException):
    """Raised when a requested aggregate or entity does not exist in persistence."""
    pass


class AuthenticationFailedException(DomainException):
    """Raised when authentication credentials or cryptographic tokens are invalid."""
    pass
