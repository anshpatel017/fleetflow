from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models


class CustomUserManager(BaseUserManager):
    """Email-based user manager — username is not used."""

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


import uuid

class CustomUser(AbstractUser):
    username = None  # remove username field

    user_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
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

    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128, db_column='password_hash')  # Map to native schema column
    full_name = models.CharField(max_length=100, blank=True, default='', db_column='name')
    phone = models.CharField(max_length=20, blank=True, null=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default=FLEET_MANAGER)
    profile_image = models.ImageField(upload_to='profile_pics/', blank=True, null=True)
    
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    
    date_joined = models.DateTimeField(auto_now_add=True, db_column='created_at')
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    class Meta:
        db_table = 'users'

    def __str__(self):
        return self.email
