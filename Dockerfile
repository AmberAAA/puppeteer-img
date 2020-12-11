FROM node
RUN git clone https://github.com/AmberAAA/puppeteer-img.git \
    && cd puppeteer-img \
    && npm i \
    && npm start
