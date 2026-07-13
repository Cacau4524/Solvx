/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        'solvy-blue': '#2563EB',
        'solvy-green': '#7AC943',
      },
    },
  },
  // As classes utilitárias do Tailwind ficam disponíveis para uso pontual,
  // mas os componentes já existentes usam SCSS com variáveis do tema —
  // por isso o "important" e reset globais ficam desligados para não
  // conflitar com os estilos do Angular Material.
  corePlugins: {
    preflight: false,
  },
  plugins: [],
};
