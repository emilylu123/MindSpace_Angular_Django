# A version of python alpine with installed grpcio tool
FROM basisai/python-alpine-grpcio:3.8.6-1.33.1
LABEL authors="Team24"

# This is recommended for running python in Docker
ENV PYTHONUNBUFFERED 1

# Copy requirements.txt from that in the current folder to that in Docker 
COPY ./requirements.txt /requirements.txt

# Install/Update dependencies (linux-headers is needed for Apple M1)
RUN apk add --update --no-cache --virtual .tmp-build-deps gcc python3-dev musl-dev mariadb-dev linux-headers
RUN apk add --update --no-cache mariadb-connector-c
RUN pip install --upgrade pip
RUN pip install -r /requirements.txt
# Delete the dependencies for building 
RUN apk del .tmp-build-deps

# Create a 'app' folder in Docker
# Set it to be the starting location for running the application
RUN mkdir /app
WORKDIR /app
COPY ./app /app

# Create a single user named 'user' for running this application
RUN adduser -D user
# Switch running user from root to the created 'user'
# It is essential for security purposes
USER user


# Building the Docker image by running:
# docker build . 
# After installing docker on your computer