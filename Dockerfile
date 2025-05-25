# 1. Base Image
FROM node:18-alpine AS base

# 2. Install pnpm
RUN npm install -g pnpm

# 3. Set Working Directory
WORKDIR /app

# 4. Copy package.json and pnpm-lock.yaml
COPY package.json ./
COPY pnpm-lock.yaml ./

# 5. Install Dependencies
# Use --frozen-lockfile to ensure CI/CD reproducibility
RUN pnpm install --frozen-lockfile

# 6. Copy Application Source Code
COPY . .

# 7. Build the Application
# NEXT_PUBLIC_API_BASE_URL is a runtime variable, so it doesn't need to be set at build time here
# If other build-time variables were needed, they could be passed with ARG and ENV
RUN pnpm build

# 8. Set PORT Environment Variable
ENV PORT 3000

# 9. Expose Port
EXPOSE 3000

# 10. Define Command to Run Application
CMD ["pnpm", "start"]
