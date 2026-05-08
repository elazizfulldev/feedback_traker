#!/bin/bash
set -e

echo "⏳ Waiting for database..."
while ! php artisan db:monitor --databases=mysql 2>/dev/null; do
    sleep 2
done

echo "✅ Database is ready"

# Generate key if not set
if [ -z "$APP_KEY" ] || [ "$APP_KEY" = "" ]; then
    echo "🔑 Generating application key..."
    php artisan key:generate --force
fi

# Run migrations
echo "🗄️ Running migrations..."
php artisan migrate --force

# Seed only if users table is empty (first run)
USER_COUNT=$(php artisan tinker --execute="echo App\Models\User::count();" 2>/dev/null | tail -1)
if [ "$USER_COUNT" = "0" ] || [ -z "$USER_COUNT" ]; then
    echo "🌱 Seeding database..."
    php artisan db:seed --force
fi

# Cache config for production
echo "⚡ Caching configuration..."
php artisan config:cache
php artisan route:cache

echo "🚀 Starting Laravel server..."
exec "$@"
