"""JWT Token Provider implementing secure administrative session state.

Uses PyJWT with HS256 and configurable expiration windows.
"""

from datetime import datetime, timezone, timedelta
import jwt

from app.domain.exceptions.domain_exceptions import AuthenticationFailedException


class JwtTokenProvider:
    """Issues and decodes cryptographically signed JSON Web Tokens."""

    def __init__(
        self,
        secret_key: str,
        algorithm: str = "HS256",
        expiration_seconds: int = 86400,
    ) -> None:
        """Initializes token provider with secret parameters.

        Args:
            secret_key (str): Secret HMAC key with minimum 32 bytes entropy.
            algorithm (str): Cryptographic algorithm (default HS256).
            expiration_seconds (int): Lifespan of issued access tokens.
        """
        if len(secret_key) < 16:
            raise ValueError("JWT secret key must be sufficiently secure.")

        self._secret = secret_key
        self._algorithm = algorithm
        self._expiration = expiration_seconds

    def create_access_token(self, subject: str) -> str:
        """Signs and encodes a new JWT bearer token for the specified subject.

        Args:
            subject (str): Unique subject identity (username).

        Returns:
            str: Base64-encoded signed token string.
        """
        now = datetime.now(timezone.utc)
        payload = {
            "sub": subject,
            "iat": now,
            "exp": now + timedelta(seconds=self._expiration),
        }
        return jwt.encode(payload, self._secret, algorithm=self._algorithm)

    def decode_access_token(self, token: str) -> str:
        """Decodes and validates signature and expiration of access token.

        Args:
            token (str): JWT string received in HTTP Authorization header.

        Returns:
            str: Validated subject (username).

        Raises:
            AuthenticationFailedException: If token is expired, tampered with, or malformed.
        """
        try:
            payload = jwt.decode(
                token,
                self._secret,
                algorithms=[self._algorithm],
            )
            sub = payload.get("sub")
            if not sub:
                raise AuthenticationFailedException("Token payload missing subject.")
            return str(sub)
        except jwt.ExpiredSignatureError as err:
            raise AuthenticationFailedException("Authentication token has expired.") from err
        except jwt.PyJWTError as err:
            raise AuthenticationFailedException("Invalid or malformed authentication token.") from err
