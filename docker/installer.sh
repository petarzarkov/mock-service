#!/bin/bash -x

set -e

function installer {
    for i in "$@"
        do
        case $i in
        --build-dirs=*)
            buildDirs="${i#*=}"
            ;;
        --build-ts=*)
            buildTs="${i#*=}"
            ;;
        --skip-install=*)
            skipInstall="${i#*=}"
            ;;
        --lint=*)
            lint="${i#*=}"
            ;;
        --run-unit=*)
            runUnit="${i#*=}"
            ;;
        --prune-deps=*)
            pruneDeps="${i#*=}"
            ;;
        *)
            # unknown option
            ;;
        esac
    done

    baseDir=$(pwd)

    declare -a dirs=(${buildDirs})

    echo -e "\e[1;32m=================== Installer Starting ===================\e[0m"
    start=$SECONDS

    if [[ "${skipInstall}" != "y" ]]; then
        echo -e "\e[35m=================== Starting pnpm install ===================\e[0m"
        pnpm install
    fi


    if [[ "${lint}" = "y" ]]; then
        echo -e "\e[33m=================== Linting ===================\e[0m"
        pnpm run lint
    fi

    if [[ "${buildTs}" = "y" ]]; then
        echo -e "\e[34m=================== Building ===================\e[0m"
        pnpm run build
    fi


    if [[ "${runUnit}" = "y" ]]; then
        echo -e "\e[33m=================== Testing ===================\e[0m"
        npm run test:coverage
    fi


    echo -e "\e[36m=================== Finished install and build  ===================\e[0m"


    if [[ "${pruneDeps}" = "y" ]]; then
        echo -e "\e[33m=================== Pruning Global devDeps ===================\e[0m"
        pnpm prune --production
    fi

    duration=$(( SECONDS - start ))
    echo -e "\e[1;32m=================== Installer Finished, Time taken: ${duration}s ===================\e[0m"
}

installer --build-dirs="${BUILD_DIRS:=$DEFAULT_BUILD_DIRS}" --build-ts=y --prune-deps="${PRUNE_DEPS:-"n"}" --lint=y --run-unit=n