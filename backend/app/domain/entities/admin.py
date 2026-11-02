"""AdminUser domain entity representing authorized dashboard administrator.

Stores credentials and encapsulates session state validation.
"""

from datetime import datetime, timezone
from typing import Optional

from app.domain.exceptions.domain_exceptions import DomainValidationError


class AdminUser:
    """Domain entity representing the system administrator authorized to access the control panel.

    Attributes:
        id (str): Unique identifier for the user.
        username (str): System login username.
        password_hash (str): Bcrypt cryptographic password hash.
        created_at (datetime): Account generation timestamp.
    """

    def __init__(
        self,
        id: str,
        username: str,
        password_hash: str,
        created_at: Optional[datetime] = None,
    ) -> None:
        """Initializes AdminUser entity enforcing non-empty invariants."""
        if not username or not username.strip():
            raise DomainValidationError("Admin username must not be empty.")
        if not password_hash or not password_hash.strip():
            raise DomainValidationError("Admin password hash must not be empty.")

        self.id = id
        self.username = username.strip().lower()
        self.password_hash = password_hash.strip()
        self.created_at = created_at or datetime.now(timezone.utc)
