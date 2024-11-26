# Use Node.js as the base image
FROM node:20

ARG AZURE_VM_IP
ARG PORT

COPY . .

RUN touch /autofeedback-webapp/.env
RUN echo "REACT_APP_API=http://${AZURE_VM_IP}:${PORT}/api" > ./autofeedback-webapp/.env

# Install dependencies for both frontend and backend
RUN npm install

# Build the project (frontend + backend)
RUN npm run build

# Expose port
EXPOSE 80

# Start the backend server
CMD ["npm", "start"]