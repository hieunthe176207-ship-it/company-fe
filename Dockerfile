# ===== STAGE 1: BUILD APP =====
FROM node:20-alpine AS builder

WORKDIR /app

# Copy file package để cài deps
COPY package*.json ./

RUN npm install

# Copy source
COPY . .

# Build Vite -> dist
RUN npm run build


# ===== STAGE 2: RUN VITE PREVIEW (KHÔNG NGINX) =====
FROM node:20-alpine

WORKDIR /app

# Copy dist từ stage build
COPY --from=builder /app/dist ./dist

# Cài vite global để dùng `vite preview` (hoặc dùng script có sẵn trong package.json)
RUN npm install -g vite

# Port default của vite preview là 4173
EXPOSE 4173

# Chạy preview, bật host 0.0.0.0 để truy cập từ ngoài
CMD ["vite", "preview", "--host", "0.0.0.0", "--port", "4173"]
