# docker pull tensorflow/serving
docker run -p 8501:8501 \
  --mount type=bind,source="$(pwd)/build",target=/models/digit-recognition \
  -e MODEL_NAME=digit-recognition -t tensorflow/serving