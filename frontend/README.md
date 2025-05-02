# Projeto Teddy

Este projeto é uma aplicação de micro front-ends (facilitando o desenvolvimento individiual de um módulo especifico) para cadastro e gestão de parceiros e empresas externas. A aplicação utiliza React (com PrimeReact) e Angular 15. O projeto é containerizado para facilitar o deploy em ambientes de cloud, como AWS ECS.

## Tecnologias Utilizadas

- **Frontend:** React, PrimeReact, Angular 15
- **Containerização:** Docker
- **JS-Cookie:** Gestão de cookies
- **Vite:** Build da aplicação
- **Vercel:** Deploy aplicação
- **Styled-Components**

## Estrutura do Projeto

- `src/` - Código-fonte da aplicação.
- `public/` - Arquivos estáticos e `index.html`.

## TODO / TASKS
- [ ] Implementar testes unitários (estimado: 3 dias)
- [ ] Automatizar testes de integração (estimado: 5 dias)

## Configuração do Projeto

### 1. Clonando o Repositório

```sh
git clone https://github.com/kayahaufe/teddy.git
cd teddy
```

Rode o seguinte comando no diretório do projeto

```
npm install && npm run dev
```

### Configuração do Docker

Certifique-se de estar na raiz do projeto e execute:

```sh
npm run build
docker build -t teddy .
```

Rode o container

```
docker run -p 5173:5173 teddy
```
