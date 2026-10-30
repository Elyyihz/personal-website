"""Unit tests for Application Use Cases following TDD discipline.

Tests use cases using in-memory mock repository adapters and verified security services.
"""

from datetime import datetime, timezone
import pytest

from app.domain.entities.project import Project
from app.domain.entities.wishlist import WishlistItem
from app.domain.entities.media import ConsumedMedia
from app.domain.entities.hobby import HobbyInterest
from app.domain.entities.admin import AdminUser
from app.domain.exceptions.domain_exceptions import EntityNotFoundException, AuthenticationFailedException
from app.application.dtos.project_dto import ProjectCreateDTO, ProjectUpdateDTO
from app.application.dtos.wishlist_dto import WishlistCreateDTO, WishlistUpdateDTO
from app.application.dtos.media_dto import MediaUpdateDTO
from app.application.dtos.hobby_dto import HobbyCreateDTO, HobbyUpdateDTO
from app.application.dtos.auth_dto import LoginRequestDTO
from app.application.use_cases.project_use_cases import ProjectUseCases
from app.application.use_cases.wishlist_use_cases import WishlistUseCases
from app.application.use_cases.media_use_cases import MediaUseCases
from app.application.use_cases.hobby_use_cases import HobbyUseCases
from app.application.use_cases.auth_use_cases import AuthUseCases


class InMemoryProjectRepository:
    """Mock repository for Project tests."""
    def __init__(self):
        self.items = {}

    async def get_all(self):
        return list(self.items.values())

    async def get_by_id(self, project_id: str):
        return self.items.get(project_id)

    async def save(self, project: Project):
        self.items[project.id] = project
        return project

    async def delete(self, project_id: str):
        if project_id in self.items:
            del self.items[project_id]
            return True
        return False


class InMemoryWishlistRepository:
    """Mock repository for Wishlist tests."""
    def __init__(self):
        self.items = {}

    async def get_all(self, category=None):
        if category:
            return [i for i in self.items.values() if i.category == category]
        return list(self.items.values())

    async def get_by_id(self, item_id: str):
        return self.items.get(item_id)

    async def save(self, item: WishlistItem):
        self.items[item.id] = item
        return item

    async def delete(self, item_id: str):
        if item_id in self.items:
            del self.items[item_id]
            return True
        return False


class InMemoryMediaRepository:
    """Mock repository for Media tests."""
    def __init__(self):
        self.media = ConsumedMedia()

    async def get(self):
        return self.media

    async def save(self, media: ConsumedMedia):
        self.media = media
        return media


class InMemoryHobbyRepository:
    """Mock repository for Hobby tests."""
    def __init__(self):
        self.items = {}

    async def get_all(self):
        return list(self.items.values())

    async def get_by_id(self, hobby_id: str):
        return self.items.get(hobby_id)

    async def save(self, hobby: HobbyInterest):
        self.items[hobby.id] = hobby
        return hobby

    async def delete(self, hobby_id: str):
        if hobby_id in self.items:
            del self.items[hobby_id]
            return True
        return False


class MockPasswordHasher:
    """Mock password hasher for testing."""
    def hash_password(self, password: str) -> str:
        return f"hashed_{password}"

    def verify_password(self, password: str, hashed: str) -> bool:
        return hashed == f"hashed_{password}"


class MockTokenProvider:
    """Mock JWT token provider."""
    def create_access_token(self, subject: str) -> str:
        return f"jwt_token_for_{subject}"

    def decode_access_token(self, token: str) -> str:
        if token.startswith("jwt_token_for_"):
            return token.replace("jwt_token_for_", "")
        raise AuthenticationFailedException("Invalid token signature")


class InMemoryAdminRepository:
    """Mock repository for Admin users."""
    def __init__(self):
        self.users = {}

    async def get_by_username(self, username: str):
        return self.users.get(username.lower())

    async def save(self, user: AdminUser):
        self.users[user.username] = user
        return user


@pytest.mark.asyncio
async def test_project_use_cases_crud():
    repo = InMemoryProjectRepository()
    use_cases = ProjectUseCases(repo)

    # 1. Create
    dto = ProjectCreateDTO(
        title="Distributed Video Inference Pipeline",
        description="Parallel video inference with AMQP workers",
        tags=["FastAPI", "RabbitMQ"],
        github_url="https://github.com/Elyyihz/distributed-video",
        featured=True,
        icon_slug="code",
    )
    created = await use_cases.create_project(dto)
    assert created.title == dto.title
    assert created.featured is True

    # 2. List
    all_projects = await use_cases.list_projects()
    assert len(all_projects) == 1

    # 3. Update
    updated = await use_cases.update_project(
        created.id,
        ProjectUpdateDTO(
            title="Updated Pipeline",
            description="Enhanced queue performance",
            tags=["FastAPI", "RabbitMQ", "YOLOv8"],
            featured=False,
            icon_slug="sparkles",
        ),
    )
    assert updated.title == "Updated Pipeline"
    assert updated.featured is False
    assert updated.icon_slug == "sparkles"

    # 4. Delete
    deleted = await use_cases.delete_project(created.id)
    assert deleted is True
    assert len(await use_cases.list_projects()) == 0


@pytest.mark.asyncio
async def test_wishlist_use_cases_crud_and_fulfilled_toggle():
    repo = InMemoryWishlistRepository()
    use_cases = WishlistUseCases(repo)

    # Create
    item_dto = WishlistCreateDTO(
        title="The Man in the High Castle",
        subtitle="Philip K. Dick",
        category="Livros",
        url="https://amazon.com.br/dp/test",
        tag="Ficção Científica",
        is_fulfilled=False,
    )
    created = await use_cases.create_item(item_dto)
    assert created.title == item_dto.title
    assert created.is_fulfilled is False

    # Toggle fulfilled
    toggled = await use_cases.toggle_fulfilled(created.id)
    assert toggled.is_fulfilled is True

    # Toggle again
    toggled_back = await use_cases.toggle_fulfilled(created.id)
    assert toggled_back.is_fulfilled is False

    # Delete
    assert await use_cases.delete_item(created.id) is True


@pytest.mark.asyncio
async def test_auth_use_cases():
    admin_repo = InMemoryAdminRepository()
    hasher = MockPasswordHasher()
    token_provider = MockTokenProvider()

    # Seed admin user
    await admin_repo.save(
        AdminUser(
            id="admin-root",
            username="elyyihz",
            password_hash=hasher.hash_password("admin_secret"),
        )
    )

    auth = AuthUseCases(
        admin_repo=admin_repo,
        hasher=hasher,
        token_provider=token_provider,
    )

    # Valid login
    login_resp = await auth.login(
        LoginRequestDTO(username="elyyihz", password="admin_secret")
    )
    assert login_resp.access_token == "jwt_token_for_elyyihz"
    assert login_resp.token_type == "bearer"

    # Invalid login
    with pytest.raises(AuthenticationFailedException):
        await auth.login(
            LoginRequestDTO(username="elyyihz", password="wrong_password")
        )


@pytest.mark.asyncio
async def test_media_use_cases():
    media_repo = InMemoryMediaRepository()
    use_cases = MediaUseCases(media_repo)

    current = await use_cases.get_media()
    assert current.reading.title == "The Man in the High Castle"

    update_dto = MediaUpdateDTO(
        reading={
            "title": "Do Androids Dream of Electric Sheep?",
            "author": "Philip K. Dick",
            "category": "Ficção Científica",
            "cover_url": "https://example.com/cover.jpg",
            "reference_url": "https://amazon.com.br/dp/test",
            "status": "Lendo Atualmente",
        },
        watching={
            "title": "Blade Runner 2049",
            "subtitle": "Direção Denis Villeneuve",
            "cover_url": "https://example.com/blade.jpg",
            "category": "Cinema & Cyberpunk",
        },
    )
    updated = await use_cases.update_media(update_dto)
    assert updated.reading.title == "Do Androids Dream of Electric Sheep?"
    assert updated.watching.title == "Blade Runner 2049"


@pytest.mark.asyncio
async def test_hobby_use_cases():
    hobby_repo = InMemoryHobbyRepository()
    use_cases = HobbyUseCases(hobby_repo)

    create_dto = HobbyCreateDTO(
        name="Stardew Valley",
        icon_slug="plant",
        category="Cozy Gaming",
    )
    created = await use_cases.create_hobby(create_dto)
    assert created.name == "Stardew Valley"
    assert created.icon_slug == "plant"

    hobbies = await use_cases.list_hobbies()
    assert len(hobbies) == 1

    update_dto = HobbyUpdateDTO(
        name="Pokémon Emerald",
        category="Gaming & Lore",
        icon_slug="gamepad",
    )
    updated = await use_cases.update_hobby(created.id, update_dto)
    assert updated.name == "Pokémon Emerald"
    assert updated.icon_slug == "gamepad"

    assert await use_cases.delete_hobby(created.id) is True
    assert len(await use_cases.list_hobbies()) == 0
