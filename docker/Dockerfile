FROM node:14.18.0-alpine AS base
RUN apk update && apk add bash && apk add python3 && apk add make && apk add build-base && apk add curl
RUN npm i -g npm@7.24.2
RUN npm i -g pnpm@7.5.2

FROM base as build-env
ARG GIT_BRANCH
ARG GIT_COMMIT_TAG
ARG BUILD_DIRS
ARG PRUNE_DEPS
ARG APP_IMAGE_DIR
ENV GIT_BRANCH=${GIT_BRANCH}
ENV GIT_COMMIT_TAG=${GIT_COMMIT_TAG}
ENV BUILD_DIRS=${BUILD_DIRS}
ENV PRUNE_DEPS=${PRUNE_DEPS:-"n"}
ENV APP_IMAGE_DIR=${APP_IMAGE_DIR}
RUN mkdir ${APP_IMAGE_DIR}
RUN chown node:node -R ${APP_IMAGE_DIR}
USER node
WORKDIR ${APP_IMAGE_DIR}
ENV WORKSPACE="${APP_IMAGE_DIR}"

# Build all 
COPY --chown=node:node . .
RUN ["/bin/bash", "-x", "docker/installer.sh"]
RUN du -h -d 1 .

FROM build-env as production-env
ARG GIT_BRANCH
ARG GIT_COMMIT_TAG
ENV GIT_BRANCH=${GIT_BRANCH}
ENV GIT_COMMIT_TAG=${GIT_COMMIT_TAG}
USER node
ARG SERVICE_PORT
ENV SERVICE_PORT=$SERVICE_PORT
EXPOSE $SERVICE_PORT
CMD ["npm", "start"]
