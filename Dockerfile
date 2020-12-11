FROM node
RUN git clone https://github.com/AmberAAA/puppeteer-img.git --depth==1 \
    && cd puppeteer-img \
    && npm i \
    && npm start
