FROM node:16.15.1-alpine AS base
RUN apk update && apk add bash && apk add python3 && apk add make && apk add build-base && apk add curl
RUN npm i -g npm@7.24.2
RUN npm i -g pnpm@7.13.4

FROM base as build-env
ARG GIT_BRANCH
ARG GIT_COMMIT_TAG
ARG PRUNE_DEPS
ARG APP_IMAGE_DIR
ENV GIT_BRANCH=${GIT_BRANCH}
ENV GIT_COMMIT_TAG=${GIT_COMMIT_TAG}
ENV PRUNE_DEPS=${PRUNE_DEPS:-"n"}
ENV APP_IMAGE_DIR=${APP_IMAGE_DIR:-"/app"}
ENV WORKSPACE="${APP_IMAGE_DIR}"

# Build all 
COPY . ${APP_IMAGE_DIR}
WORKDIR ${APP_IMAGE_DIR}
RUN ["/bin/bash", "-x", "docker/installer.sh"]
RUN du -h -d 1 .

FROM build-env as production-env
ARG GIT_BRANCH
ARG GIT_COMMIT_TAG
ENV GIT_BRANCH=${GIT_BRANCH}
ENV GIT_COMMIT_TAG=${GIT_COMMIT_TAG}
ARG SERVICE_PORT
ENV SERVICE_PORT=${SERVICE_PORT:-"5055"}
EXPOSE $SERVICE_PORT
CMD ["npm", "start"]
