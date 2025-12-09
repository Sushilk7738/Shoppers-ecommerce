import os
from dotenv import load_dotenv, find_dotenv

path = find_dotenv()
print("FOUND .env PATH:", path)

load_dotenv(path)

print("ENV VALUE:", os.getenv("DJANGO_SECRET_KEY"))
