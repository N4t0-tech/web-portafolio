# Portafolio — Renato Campos

Portafolio personal con estética **Windows 98**, construido con HTML, CSS y JavaScript puro. Funciona como un escritorio interactivo: las secciones son ventanas arrastrables, redimensionables y minimizables.

## Vista previa

Al abrir el sitio aparece una **boot screen** estilo Win98 con barra de carga. Luego se revela el escritorio con iconos, ventanas y una taskbar funcional en la parte inferior.

## Características

- **Escritorio interactivo** — ventanas arrastrables, redimensionables, minimizables y maximizables
- **Boot screen** — pantalla de carga al iniciar
- **Screensaver** — se activa tras 30 segundos de inactividad con texto rebotando
- **Menú Inicio** — navegación estilo Win98 con opción de apagar
- **Taskbar** — muestra las ventanas abiertas y reloj en tiempo real
- **Sonidos** — generados con Web Audio API (abrir, cerrar, minimizar, inicio)
- **Blog estilo 2000s** — página "Acerca de" con pestañas, entradas y sidebar con widgets
- **SPA** — todo el contenido en una sola página, sin recargas

## Ventanas

| Ventana | Contenido |
|---|---|
| 📁 Mi Portafolio | Proyectos con mini-ventanas individuales |
| 📝 Blog | Perfil estilo blog años 2000 con pestañas y sidebar |
| ⚙️ Servicios | Próximamente |
| 📧 Contacto | Instagram, GitHub y Gmail |

## Tecnologías

- **[98.css](https://jdan.github.io/98.css/)** — estilos Windows 98
- **Mononoki Nerd Font** — fuente principal (self-hosted)
- **Web Audio API** — sonidos generados por código
- HTML5 / CSS3 / JavaScript vanilla — sin frameworks ni bundlers

## Desarrollo local

No requiere instalación. Abre `index.html` directamente en el navegador, o usa un servidor local para live reload:

```bash
npx live-server
```

## Estructura

```
├── index.html          # SPA principal (escritorio completo)
├── acercade.html       # Página blog independiente
├── contacto.html       # Página contacto independiente
├── servicios.html      # Página servicios independiente
├── css/
│   ├── common.css      # Estilos base del escritorio y taskbar
│   ├── desktop.css     # Boot screen, screensaver, iconos, menú inicio
│   ├── index.css       # Ventana portafolio y proyectos
│   ├── acercade.css    # Blog layout y sidebar
│   ├── contacto.css    # Grid de contacto
│   └── servicios.css   # Página servicios
├── js/
│   ├── desktop.js      # Toda la lógica del escritorio (SPA)
│   └── common.js       # Reloj (usado en páginas independientes)
├── fonts/
│   └── MononokiNerdFontMono-Regular.ttf
└── resurces/           # Imágenes de proyectos y contacto
```

## Autor

**Renato Campos** — Tecnólogo en Telecomunicaciones
[github.com/N4t0-tech](https://github.com/N4t0-tech)
