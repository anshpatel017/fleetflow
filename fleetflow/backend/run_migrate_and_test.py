"""
Run this script to apply migrations non-interactively and then test signup.
"""
import os
import sys
import subprocess
import io

# Set working directory
base = os.path.dirname(os.path.abspath(__file__))
python = os.path.join(base, 'venv', 'Scripts', 'python.exe')

env = os.environ.copy()
env['DJANGO_SETTINGS_MODULE'] = 'config.settings'

print("Step 1: makemigrations --no-input accounts")
r = subprocess.run(
    [python, 'manage.py', 'makemigrations', '--no-input', 'accounts'],
    cwd=base, env=env, capture_output=True, text=True
)
print(r.stdout or r.stderr or "(no output)")

print("\nStep 2: makemigrations --no-input (all apps)")
r = subprocess.run(
    [python, 'manage.py', 'makemigrations', '--no-input'],
    cwd=base, env=env, capture_output=True, text=True
)
print(r.stdout or r.stderr or "(no output)")

print("\nStep 3: migrate")
r = subprocess.run(
    [python, 'manage.py', 'migrate'],
    cwd=base, env=env, capture_output=True, text=True
)
print(r.stdout or r.stderr or "(no output)")

print("\nStep 4: Test signup via ORM")
r = subprocess.run(
    [python, 'test_signup.py'],
    cwd=base, env=env, capture_output=True, text=True
)
print(r.stdout or r.stderr or "(no output)")
