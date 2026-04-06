# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Create a non-privileged user to run the app
RUN useradd -m -u 1000 user

# Set the working directory to the user's home app directory
USER user
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH
WORKDIR $HOME/app

# Copy the requirements file into the container
COPY --chown=user requirements.txt $HOME/app/requirements.txt

# Install dependencies
RUN pip install --no-cache-dir --upgrade -r $HOME/app/requirements.txt

# Copy the rest of the application code
COPY --chown=user . $HOME/app

# Expose the port that Hugging Face Spaces uses
EXPOSE 7860

# Command to run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]
