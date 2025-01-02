# Use the latest Node.js image
FROM node:latest

# Set the working directory
WORKDIR /usr/src/app

# Copy necessary files for dependency installation
COPY package.json package-lock.json turbo.json tsconfig.json ./

# Copy the apps and packages directories
COPY apps ./apps
COPY packages ./packages

# Install dependencies
RUN npm install

# Generate Prisma client
RUN npm run orm_prisma:generate

# Filter the build down to just one app
RUN npm run build 

# Set the default command
CMD ["npm", "run", "start-user-app"]


# Note - orm_prisma:generate and start-user-app is introduced in package.json file so we are directly calling 