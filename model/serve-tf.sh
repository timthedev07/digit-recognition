#!/bin/bash

docker run -p 8501:"${PORT}" \
  --mount type=bind,source="$(pwd)/build",target=/models/digit-recognition \
  -e MODEL_NAME=digit-recognition -t tensorflow/serving