import uuid
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models


class CustomUserManager(BaseUserManager):
    """Email-based user manager."""

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is required.')
        email = self.normalize_email(email)
        extra_fields.setdefault('is_active', True)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractBaseUser):
    """
    Custom user model mapped EXACTLY to the native PostgreSQL `users` table.

    Native columns:
      user_id UUID, name VARCHAR(100), email VARCHAR(150), password_hash TEXT,
      role user_role, is_active BOOL, is_staff BOOL, is_superuser BOOL,
      created_at TIMESTAMP, last_login TIMESTAMP
    """

    FLEET_MANAGER = 'manager'
    DISPATCHER = 'dispatcher'
    SAFETY_OFFICER = 'safety_officer'
    FINANCIAL_ANALYST = 'analyst'

    ROLE_CHOICES = [
        (FLEET_MANAGER, 'Fleet Manager'),
        (DISPATCHER, 'Dispatcher'),
        (SAFETY_OFFICER, 'Safety Officer'),
        (FINANCIAL_ANALYST, 'Financial Analyst'),
    ]

    # --- Primary key ---
    user_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # --- Core columns (mapped to native names) ---
    full_name = models.CharField(max_length=100, blank=True, default='', db_column='name')
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128, db_column='password_hash')

    # --- Role & Status ---
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default=FLEET_MANAGER)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    # --- Timestamps ---
    date_joined = models.DateTimeField(auto_now_add=True, db_column='created_at')
    # last_login is managed by AbstractBaseUser automatically

    # --- Extra profile fields ---
    # These columns exist in the users table ONLY if a migration has added them.
    # If they don't exist in DB yet, remove them from here and add via migration.
    phone = models.CharField(max_length=20, blank=True, null=True, default=None)
    profile_image = models.CharField(max_length=255, blank=True, null=True, default=None)  # store path as text

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    class Meta:
        db_table = 'users'

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        return self.is_superuser

    def has_module_perms(self, app_label):
        return self.is_superuser
