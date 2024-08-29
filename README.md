# Pasos para Desplegar una Aplicación FastAPI en Google Cloud

Este documento detalla los pasos necesarios para desplegar una aplicación FastAPI en Google Cloud utilizando Docker y Google Cloud Run.

## 1. Inicializar Google Cloud CLI

Primero, inicializa la CLI de Google Cloud para asegurarte de que esté configurada correctamente.

```bash
gcloud init

gcloud auth login

gcloud config set project {ID-PROJECT}

gcloud auth configure-docker \
    {REGION}-docker.pkg.dev

docker tag fastapi {REGION}-docker.pkg.dev/{PROJECT_ID}/{REPO_NAME}/fastapi

docker push {REGION}-docker.pkg.dev/{PROJECT_ID}/{REPO_NAME}/fastapi

gcloud artifacts docker images list {REGION}-docker.pkg.dev/{PROJECT_ID}/{REPO_NAME}

gcloud run deploy fastapi --port 8000 --platform=managed --allow-unauthenticated --region={RUN_REGION} --image={REGION}-docker.pkg.dev/{PROJECT_ID}/{REPO_NAME}/fastapi@sha256:{IMAGE_SHA}

```
