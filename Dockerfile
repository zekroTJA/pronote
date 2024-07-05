FROM oven/bun:alpine AS build-webapp
WORKDIR /build
COPY webapp .
RUN bun install && \
    bun run build

FROM rust:slim AS build-backend
WORKDIR /build
COPY .cargo/ .cargo/
COPY database/ database/
COPY server/ server/
COPY Cargo.toml .
COPY Cargo.lock .
RUN apt-get update && apt-get install -y pkg-config libssl-dev
RUN cargo build -p server --release

FROM debian:12-slim
RUN apt-get update && apt-get install -y libssl-dev
COPY --from=build-webapp /build/dist /app/webapp/dist
COPY --from=build-backend /build/target/release/server /app/server
ENTRYPOINT [ "/app/server" ]