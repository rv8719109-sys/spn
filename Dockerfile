# PHP + Apache
FROM php:8.2-apache

# Enable Apache rewrite (optional but useful)
RUN a2enmod rewrite

# Copy your site into the Apache web root
COPY . /var/www/html/

# If you want Apache to prefer index.php over index.html, uncomment next line:
# RUN sed -i 's/DirectoryIndex index.html/DirectoryIndex index.php index.html/' /etc/apache2/mods-enabled/dir.conf

EXPOSE 80
