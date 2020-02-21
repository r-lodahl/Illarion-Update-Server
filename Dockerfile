FROM node:10.13.0-alpine

# Update apk
RUN apk update
RUN apk upgrade

# Install git
RUN apk add git

# Download and install texturepacker
RUN apk add dpkg
RUN curl "https://www.codeandweb.com/download/texturepacker/5.3.0/TexturePacker-5.3.0-ubuntu64.deb" --output packer.deb
RUN dpkg -i packer.deb

# Get the git repos
WORKDIR /usr/git
RUN git "https://r-lodahl:PASSWORD@gitlab.com/illarion-ev/map"
RUN git "https://r-lodahl:PASSWORD@gitlab.com/illarion-ev/books"
RUN git "https://r-lodahl:PASSWORD@gitlab.com/illarion-ev/tiles"
RUN git "https://r-lodahl:PASSWORD@gitlab.com/illarion-ev/characters"
RUN git "https://r-lodahl:PASSWORD@gitlab.com/illarion-ev/effects"
RUN git "https://r-lodahl:PASSWORD@gitlab.com/illarion-ev/music"
RUN git "https://r-lodahl:PASSWORD@gitlab.com/illarion-ev/sounds"
RUN git "https://r-lodahl:PASSWORD@gitlab.com/illarion-ev/tables"
RUN git "https://r-lodahl:PASSWORD@gitlab.com/illarion-ev/items"

# Build and start the update server
WORKDIR /usr/src/app
COPY package.json .
RUN npm install
ADD . /usr/src/app
RUN npm run tsc
CMD ["npm", "start"]
EXPOSE 3000