# Use uma imagem base com Node.js
FROM node:18

# Defina o diretório de trabalho
WORKDIR /app

# Copie os arquivos package.json e package-lock.json
COPY package*.json ./

# Instale as dependências com logging detalhado
RUN npm install --verbose

# Copie o restante dos arquivos do projeto
COPY . .

# Exponha a porta que o app vai usar
EXPOSE 5173

# Comando para rodar o app
CMD ["npm", "run", "preview"]
