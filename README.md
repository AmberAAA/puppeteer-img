docker run -d --network host --name puppeteer -v /mnt/user/data/pu/:/data/ amberaaa/puppeteer

docker pull amberaaa/puppeteer-img

docker run -d \
    -v /mnt/user/appdata/nextcloud:/var/www/html \
    -v /mnt/user/data:/var/www/html/data \
    --name nextcloud \
    --network bridge \
    -p 4040:80 \
    nextcloud