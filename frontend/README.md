# Absolute Cinema Frontend

Este é um projeto front-end em React com TypeScript, usando Tailwind CSS para estilização e variáveis CSS para padrões de cores e fontes.

---

## Tecnologias Usadas

- React (com TypeScript)
- Tailwind CSS
- React Router DOM
- CSS Custom Properties (variáveis CSS)
- Create React App (CRA)

---

## Como Rodar Localmente

1. Clone o repositório:
   ```bash
   git clone https://seurepositorio.git
   cd nome-do-projeto
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Rode a aplicação:
   ```bash
   npm start
   ```

4. Acesse [http://localhost:3000](http://localhost:3000) no navegador.

---

## Padrões de Estilo

### Variáveis CSS (CSS Custom Properties)

As cores, fontes e sombras do projeto estão definidas em `src/frontend/colors.css` usando variáveis CSS no `:root`.  
Exemplo:

```css
:root {
  --id-color-white: #ffffff;
  --id-color-yellow: #FFDD00;
  --id-color-dark-blue: #14181C;
  --id-font: 'Poppins', sans-serif;
  /* ... */
}
```

Use essas variáveis para manter consistência, por exemplo:

```css
background-color: var(--id-color-dark-blue);
color: var(--id-color-white);
font-family: var(--id-font);
```

---

### Tailwind CSS

O Tailwind está configurado para usar os arquivos dentro de `src/**/*.{js,jsx,ts,tsx}`.  
Para usar as cores e fontes definidas, estenda o `tailwind.config.js` (exemplo básico):

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        'dark-blue': '#14181C',
        'yellow': '#FFDD00',
        // adicione mais cores conforme as variáveis CSS
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      }
    }
  }
}
```

No código, use classes Tailwind assim:

```jsx
<div className="bg-dark-blue text-white font-poppins">
  Conteúdo estilizado
</div>
```

---

## Links Úteis

- [Documentação React](https://reactjs.org/)
- [Documentação Tailwind CSS](https://tailwindcss.com/docs)
- [Create React App](https://create-react-app.dev/)
- [React Router DOM](https://reactrouter.com/)