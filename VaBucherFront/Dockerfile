# Use the official Node.js image as the base image
FROM node:latest

# Set the working directory
WORKDIR /app

# Copy the application files
COPY . /app

# Install the application dependencies
RUN npm install

# Build the application
RUN npm run build

# Expose the app port
EXPOSE 4200

# Define the command to run the application
CMD ["npm", "start"]
