FROM node:18-bullseye AS node

WORKDIR /usr/src/nian
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN PUBLIC_URL=https://nian.g.maxmoren.com npm run build

FROM golang:1.19-bullseye

WORKDIR /usr/src/nian

COPY go.mod go.sum ./
RUN go mod download && go mod verify

COPY --from=node /usr/src/nian/build/ ./frontend/build
COPY . .
RUN go build -v -o /usr/local/bin/nian .

CMD ["nian"]
