# Use the official Microsoft .NET image as the base image
FROM mcr.microsoft.com/dotnet/sdk:latest

# Set the working directory
WORKDIR /app

# Copy the application files
COPY . /app

# Restore the application dependencies
RUN dotnet restore

# Build the application in release mode
RUN dotnet build --configuration Release

# Expose the app port
EXPOSE 80

# Define the command to run the application
CMD ["dotnet", "run", "--urls", "http://*:80"]
