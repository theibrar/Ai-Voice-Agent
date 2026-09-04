FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

EXPOSE 3000

# Next.js server run with 0.0.0.0 binding
CMD ["npm", "run", "dev", "--", "-H", "0.0.0.0"]