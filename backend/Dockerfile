# Menggunakan base image Node.js versi 20
FROM node:20

# Menetapkan direktori kerja di dalam container
WORKDIR /usr/src/app

# Menyalin file package.json dan package-lock.json
COPY package*.json ./

# Menginstal semua dependensi proyek
RUN npm install

# Menyalin seluruh kode sumber proyek ke dalam container
COPY . .

# Menjalankan aplikasi dalam mode development
CMD ["npm", "run", "start:dev"]