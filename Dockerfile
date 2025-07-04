# Use Node.js 18 LTS Alpine image
FROM node:18-alpine

# Set working directory inside container
WORKDIR /app

# Copy only package files to install dependencies (cache optimization)
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy the rest of the files
COPY . .

# Build the Next.js app
RUN npm run build

# Expose port 5173
EXPOSE 5173

# Start the app
CMD ["npm", "start"]