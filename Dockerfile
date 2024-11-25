# Use Node.js as the base image
FROM node:20

COPY . .

RUN touch /autofeedback-webapp/.env
RUN echo "REACT_APP_API=http://localhost:8000/api" > ./autofeedback-webapp/.env

# Install dependencies for both frontend and backend
RUN npm install

# Build the project (frontend + backend)
RUN npm run build

# Expose port
EXPOSE 8000

# Start the backend server
CMD ["npm", "start"]