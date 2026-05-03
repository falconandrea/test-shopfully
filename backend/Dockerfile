FROM php:8.5-apache AS base

# Enable Apache mod_rewrite for Laravel pretty URLs
RUN a2enmod rewrite

# Install system dependencies and PHP extensions needed by Laravel
RUN apt-get update && apt-get install -y --no-install-recommends \
        libzip-dev \
        unzip \
        libgd-dev \
    && docker-php-ext-install zip gd \
    && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Set Apache document root to Laravel's public directory
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public

RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' \
    /etc/apache2/sites-available/*.conf \
    /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Allow .htaccess overrides (mod_rewrite)
RUN sed -ri -e 's/AllowOverride None/AllowOverride All/g' \
    /etc/apache2/apache2.conf

WORKDIR /var/www/html

# -------------------------
# DEVELOPMENT STAGE
# -------------------------
FROM base AS development

# Copy composer files first for layer caching
COPY composer.json composer.lock ./
# Install ALL dependencies (including dev)
RUN composer install --no-scripts --no-autoloader --prefer-dist

# Copy application source
COPY . .

# Finish composer install (autoloader + scripts)
RUN composer dump-autoload \
    && php artisan storage:link 2>/dev/null || true

# Ensure storage & cache directories are writable
RUN chown -R www-data:www-data storage bootstrap/cache

EXPOSE 80
CMD ["apache2-foreground"]

# -------------------------
# PRODUCTION STAGE
# -------------------------
FROM base AS production

# Copy composer files first for layer caching
COPY composer.json composer.lock ./
# Install ONLY production dependencies
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist

# Copy application source
COPY . .

# Finish composer install (autoloader + scripts)
RUN composer dump-autoload --optimize \
    && php artisan storage:link 2>/dev/null || true

# Ensure storage & cache directories are writable
RUN chown -R www-data:www-data storage bootstrap/cache

EXPOSE 80
CMD ["apache2-foreground"]
