"""Bcrypt password hashing adapter adhering to Clean Architecture security specifications.

Implements PasswordHasher protocol for cryptographic credential validation.
"""

import bcrypt


class BcryptPasswordHasher:
    """Cryptographic password hasher leveraging native bcrypt algorithms."""

    def hash_password(self, password: str) -> str:
        """Generates a salt and hashes a plaintext password.

        Args:
            password (str): Raw plaintext password.

        Returns:
            str: UTF-8 encoded bcrypt hash string.
        """
        # Guard clause: disallow empty passwords
        if not password:
            raise ValueError("Password cannot be empty.")

        salt = bcrypt.gensalt(rounds=12)
        hashed_bytes = bcrypt.hashpw(password.encode("utf-8"), salt)
        return hashed_bytes.decode("utf-8")

    def verify_password(self, password: str, hashed: str) -> bool:
        """Verifies plaintext candidate against existing bcrypt hash.

        Args:
            password (str): Plaintext password to evaluate.
            hashed (str): Persisted bcrypt hash.

        Returns:
            bool: True if password matches hash, otherwise False.
        """
        if not password or not hashed:
            return False

        try:
            return bcrypt.checkpw(
                password.encode("utf-8"),
                hashed.encode("utf-8"),
            )
        except Exception:
            return False
