// Traducciones al español, usando como clave el texto original en inglés.
/**
 * Spanish translations, keyed by the English source text (registered in ../config.ts).
 *
 * English stays the single source of truth (data files and components are
 * written in English); anything missing here simply shows in English.
 * Proper names, technologies, album titles and course names are not
 * translated.
 */
export const es: Record<string, string> = {
  "Browse albums": "Explorar álbumes",
  "Previous album": "Álbum anterior",
  "Next album": "Álbum siguiente",
  "Delivery confirmation timed out. The message may have been sent; you can also contact me by email.": "Se agotó el tiempo para confirmar el envío. El mensaje podría haberse enviado; también puedes contactarme por correo.",
  "Input (hours)": "Entrada (horas)",
  "Predicted score": "Nota estimada",
  "Send a message": "Envía un mensaje",
  "How to read these results": "Cómo interpretar estos resultados",
  "Model fit relative to predicting the mean. It is not a percentage of correct predictions.": "Ajuste del modelo en comparación con predecir la media. No es un porcentaje de predicciones correctas.",
  "Mean squared error: the average squared difference between predictions and observed values. Lower is better on the same data and scale.": "Error cuadrático medio: promedio de las diferencias al cuadrado entre predicciones y valores observados. Un valor menor es mejor al usar los mismos datos y escala.",
  "Depth-first search explores a branch before going back. This project uses it to generate the maze.": "La búsqueda en profundidad explora una rama antes de retroceder. Este proyecto la utiliza para generar el laberinto.",
  "Breadth-first search explores nearby cells first. It finds a shortest path when every move has the same cost.": "La búsqueda en anchura explora primero las celdas cercanas. Encuentra un camino más corto cuando todos los movimientos tienen el mismo costo.",
  "K-nearest neighbors classifies an example using the labels of nearby examples.": "K vecinos más cercanos clasifica un ejemplo usando las etiquetas de ejemplos cercanos.",
  "A clustering score from -1 to 1. Higher values indicate better separated and more compact groups; it is not classification accuracy.": "Indicador de agrupamiento de -1 a 1. Valores mayores indican grupos mejor separados y más compactos; no representa exactitud de clasificación.",
  "Percentage points: the difference between two percentages, not a relative percentage increase.": "Puntos porcentuales: diferencia entre dos porcentajes, no un aumento porcentual relativo.",
  "Groups locations by similarity. A cluster describes concentration; it does not prove commercial demand.": "Agrupa ubicaciones por similitud. Un grupo describe concentración; no demuestra demanda comercial.",
  "Evaluates one example at a time using the remaining examples for training.": "Evalúa un ejemplo a la vez y utiliza los restantes para entrenar.",
  "Client / server": "Cliente / servidor",
  "The browser displays the interface. The contact endpoint validates the message on the server before requesting email delivery.": "El navegador muestra la interfaz. El endpoint de contacto valida el mensaje en el servidor antes de solicitar su envío por correo.",
  "A separate Vite application served within the portfolio. Its creative experiences share the language preference.": "Aplicación Vite independiente servida dentro del portafolio. Sus experiencias creativas comparten la preferencia de idioma.",

  "Message not sent. Wait a moment and try again, or use the email link.": "Mensaje no enviado. Espera un momento e inténtalo de nuevo, o usa el enlace de correo.",
  "Drag or use the arrow keys to browse. Select an album to see listening options.": "Arrastra o usa las flechas del teclado. Selecciona un álbum para ver dónde escucharlo.",
  "Use the arrows or drag to choose a project. Open it with View project.": "Usa las flechas o arrastra para elegir. Ábrelo con Ver proyecto.",
  "Move the slider from 0.5 to 15 study hours to see the model estimate. This is not a guaranteed grade.": "Mueve el control de 0.5 a 15 horas de estudio para ver la estimación del modelo. No garantiza una nota.",

  /* ---------- navigation ---------- */
  About: "Sobre mí",
  Experience: "Experiencia",
  Projects: "Proyectos",
  Skills: "Habilidades",
  Education: "Educación",
  Music: "Música",
  Contact: "Contacto",
  World: "World",
  Main: "Principal",
  Index: "Índice",
  "back to top": "volver al inicio",
  "Open menu": "Abrir menú",
  "Close menu": "Cerrar menú",
  Language: "Idioma",
  "Enter Walter's World": "Entrar a Walter's World",

  /* ---------- intro ---------- */
  "Skip intro": "Omitir introducción",
  "Replay intro": "Repetir introducción",

  /* ---------- hero ---------- */
  Currently: "Actualmente",
  "Based in": "Desde",
  "Aspiring Systems Engineer": "Aspirante a Ingeniero de Sistemas",
  "Exploring the intersection of technology, engineering and creativity. Building digital experiences with curiosity, purpose and precision.":
    "Explorando la intersección entre tecnología, ingeniería y creatividad. Construyo experiencias digitales con curiosidad, propósito y precisión.",
  "Explore my work": "Ver mi trabajo",

  /* ---------- pixel pets ---------- */
  "Pixel pets": "Mascotas pixel",
  "a pixel pet. Say hello": "una mascota pixel. Salúdala",
  "Thinking...": "Pensando...",
  "404: Ghost found": "404: Fantasma encontrado",
  "System online": "Sistema en línea",
  "Hello, world!": "¡Hola, mundo!",
  "rebooting...": "reiniciando...",

  /* ---------- section headings (multi-line titles: lines joined with \n) ---------- */
  "Software, AI\nand data.": "Software, IA\ny datos.",
  "Selected\nexperiences": "Experiencias\ndestacadas",
  "Selected\nprojects": "Proyectos\nseleccionados",
  "Education &\ncredentials": "Educación y\ncredenciales",
  ABOUT: "SOBRE MÍ",
  "Who I am, what I'm learning and where I want to go.": "Quién soy, qué estoy aprendiendo y hacia dónde quiero ir.",
  "DEVELOPMENT JOURNEY": "TRAYECTORIA",
  "Academic work and independent builds. Open a module to see responsibilities, results you can check and the tools involved.":
    "Trabajo académico y proyectos propios. Abre un módulo para ver responsabilidades, resultados que puedes comprobar y las herramientas usadas.",
  "Next module: internships and work experience will be added here.":
    "Próximo módulo: aquí se agregarán prácticas y experiencia laboral.",
  "Work from the ten-week AI and software course. Each project opens a case file with the method, the evidence and what I learned.":
    "Trabajos del curso de diez semanas de IA y software. Cada proyecto abre un expediente con el método, la evidencia y lo que aprendí.",
  SKILLS: "HABILIDADES",
  Toolkit: "Herramientas",
  "No percentages. Each skill shows where I used it, so it can be checked against the projects.":
    "Sin porcentajes. Cada habilidad muestra dónde la usé, para que pueda comprobarse con los proyectos.",
  items: "elementos",
  "EDUCATION & CERTIFICATIONS": "EDUCACIÓN Y CERTIFICACIONES",
  "Where I study, and the certifications and credentials that back up my skills.":
    "Dónde estudio, y las certificaciones y credenciales que respaldan mis habilidades.",
  "Academic journey": "Trayectoria académica",
  "Studies and programs. Certifications are listed separately below.":
    "Estudios y programas. Las certificaciones aparecen por separado más abajo.",
  "Certifications & achievements": "Certificaciones y logros",
  "Select a credential to see it larger. A verification link appears when the issuer provides one.":
    "Selecciona una credencial para verla en grande. El enlace de verificación aparece cuando el emisor lo ofrece.",
  "CURRENT ROTATION": "EN ROTACIÓN",
  "A little bit of everything, always on repeat.": "Un poco de todo, siempre en repetición.",
  CONTACT: "CONTACTO",
  "Let’s talk.": "Hablemos.",
  "Questions about a project, a collaboration or an opportunity to learn — write to me and I’ll reply by email.":
    "Preguntas sobre un proyecto, una colaboración o una oportunidad para aprender: escríbeme y te responderé por correo.",
  EMAIL: "CORREO",
  PROFILES: "PERFILES",
  LOCATION: "UBICACIÓN",

  /* ---------- about ---------- */
  "Portrait of": "Retrato de",
  "[ PORTRAIT ]": "[ RETRATO ]",
  "Photo coming soon": "Foto próximamente",
  INTERESTS: "INTERESES",
  "ACADEMIC GOAL": "META ACADÉMICA",
  "PROFESSIONAL GOAL": "META PROFESIONAL",
  STRENGTHS: "FORTALEZAS",
  "To be added": "Por agregar",
  "Become a Systems Engineer, gain professional experience, and develop technology solutions that generate a positive impact, with the long-term vision of building my own technology company.": "Formarme como Ingeniero de Sistemas, adquirir experiencia profesional y desarrollar soluciones tecnológicas que generen un impacto positivo, con la visión de crear mi propia empresa tecnológica.",
  "Analytical thinking": "Pensamiento analítico",
  "Intellectual curiosity": "Curiosidad intelectual",
  "Creativity and innovation": "Creatividad e innovación",
  "Self-directed learning": "Aprendizaje autónomo",
  "Professional goal coming soon": "Meta profesional próximamente",
  "Strengths coming soon": "Fortalezas próximamente",
  "> initializing portfolio...": "> iniciando portafolio...",
  "[OK] Identity loaded": "[OK] Identidad cargada",
  "Projects indexed": "Proyectos indexados",
  "Skills initialized": "Habilidades inicializadas",
  "USER:": "USUARIO:",
  "ROLE:": "ROL:",
  "LOC:": "UBIC.:",
  "FOCUS: Software Development / AI / Data": "ENFOQUE: Desarrollo de software / IA / Datos",
  "> ready": "> listo",

  /* ---------- profile data ---------- */
  "Building digital solutions through software, artificial intelligence and continuous learning.":
    "Construyendo soluciones digitales a través del software, la inteligencia artificial y el aprendizaje continuo.",
  "I'm a student from El Salvador working toward Systems Engineering. I'm interested in how software, artificial intelligence and data can be combined to solve real problems. Over the last ten weeks of the ¡Supérate! program I worked with algorithms, machine learning models and the development of a web application with its own backend.":
    "Soy un estudiante de El Salvador que se prepara para estudiar Ingeniería de Sistemas. Me interesa cómo el software, la inteligencia artificial y los datos pueden combinarse para resolver problemas reales. Durante las últimas diez semanas del programa ¡Supérate! trabajé con algoritmos, modelos de machine learning y el desarrollo de una aplicación web con su propio backend.",
  "Systems Engineering": "Ingeniería de Sistemas",
  "software, artificial intelligence and data": "el software, la inteligencia artificial y los datos",
  "a web application with its own backend": "una aplicación web con su propio backend",
  "Software development": "Desarrollo de software",
  "Artificial intelligence": "Inteligencia artificial",
  "Machine learning": "Machine learning",
  "Data analysis": "Análisis de datos",
  "Web development": "Desarrollo web",
  "Study Systems Engineering at university.": "Estudiar Ingeniería de Sistemas en la universidad.",

  /* ---------- experience ---------- */
  RESPONSIBILITIES: "RESPONSABILIDADES",
  "VERIFIABLE RESULTS": "RESULTADOS VERIFICABLES",
  TECHNOLOGIES: "TECNOLOGÍAS",
  "Coming soon": "Próximamente",
  "Results coming soon": "Resultados próximamente",
  "Period to be confirmed": "Periodo por confirmar",
  "Collapse details": "Ocultar detalles",
  "Show details": "Ver detalles",
  "AI, Machine Learning & Web Development": "IA, Machine Learning y Desarrollo Web",
  "Academic program": "Programa académico",
  "2026 · 10 weeks": "2026 · 10 semanas",
  "Ten weeks of practical work with algorithms, artificial intelligence, machine learning and application development, closing with this portfolio as the final project.":
    "Diez semanas de trabajo práctico con algoritmos, inteligencia artificial, machine learning y desarrollo de aplicaciones, que cierran con este portafolio como proyecto final.",
  "Completed the practical activities of the period, from supervised learning to clustering and data analysis.":
    "Completé las actividades prácticas del periodo, desde aprendizaje supervisado hasta clustering y análisis de datos.",
  "Built a web application with a React frontend and a REST backend.":
    "Construí una aplicación web con un frontend en React y un backend REST.",
  "Organised the code, files and evidence of every activity for review.":
    "Organicé el código, los archivos y la evidencia de cada actividad para su revisión.",
  "Five activities, each with its own case-file page in the Projects section.":
    "Cinco actividades, cada una con su propia página de expediente en la sección Proyectos.",
  "This portfolio, delivered as the final project of the period.": "Este portafolio, entregado como proyecto final del periodo.",
  "Machine learning algorithms": "Algoritmos de machine learning",
  "The course projects: linear regression, maze solver, K-Means & KNN and commercial hotspots":
    "Los proyectos del curso: regresión lineal, solucionador de laberintos, K-Means y KNN, y zonas comerciales",
  "See the projects": "Ver los proyectos",
  "Personal portfolio": "Portafolio personal",
  "Independent build": "Proyecto propio",
  "Personal project": "Proyecto personal",
  "Design and development of this site from scratch: visual system, reusable components, interactive canvas graphics and a validated contact API.":
    "Diseño y desarrollo de este sitio desde cero: sistema visual, componentes reutilizables, gráficos interactivos en canvas y una API de contacto validada.",
  "Defined the Editorial Engineering visual system: type, color and Blueprint language.":
    "Definí el sistema visual Editorial Engineering: tipografía, color y lenguaje Blueprint.",
  "Built the components, the animated canvas pieces and the project pages.":
    "Construí los componentes, las piezas animadas en canvas y las páginas de proyectos.",
  "Implemented the contact endpoint with validation on client and server.":
    "Implementé el endpoint de contacto con validación en el cliente y en el servidor.",
  "POST /api/contact with shared validation — try it in the Contact section.":
    "POST /api/contact con validación compartida: pruébalo en la sección Contacto.",
  "Project pages pre-rendered at build time from a typed data file.":
    "Páginas de proyectos generadas al compilar a partir de un archivo de datos tipado.",
  "Keyboard navigation and reduced-motion support across the site.":
    "Navegación con teclado y soporte de movimiento reducido en todo el sitio.",
  "Screenshot of this portfolio's home page": "Captura de la página de inicio de este portafolio",
  "Open the contact form": "Abrir el formulario de contacto",

  /* ---------- projects ---------- */
  "[ IMAGE COMING SOON ]": "[ IMAGEN PRÓXIMAMENTE ]",
  "open project page": "abrir la página del proyecto",
  "project preview": "vista previa del proyecto",
  "main project image": "imagen principal del proyecto",
  "PROJECT INDEX —": "ÍNDICE DE PROYECTO —",
  "PROJECT INDEX": "ÍNDICE DE PROYECTOS",
  "Skip to content": "Saltar al contenido",
  "MODULE:": "MÓDULO:",
  "STATUS:": "ESTADO:",
  "PERIOD:": "PERIODO:",
  DOCUMENTING: "EN DOCUMENTACIÓN",
  COMPLETE: "COMPLETO",
  DEPLOYED: "PUBLICADO",
  "IN PROGRESS": "EN PROGRESO",
  pending: "pendiente",
  "All projects": "Todos los proyectos",
  PROJECT: "PROYECTO",
  "Key figures": "Cifras clave",
  "How it works": "Cómo funciona",
  Implementation: "Implementación",
  Results: "Resultados",
  Data: "Datos",
  "What I learned": "Lo que aprendí",
  "How I built it — pending": "Cómo lo construí: pendiente",
  "Results will be added from the original project files": "Los resultados se agregarán a partir de los archivos originales del proyecto",
  "Dataset details coming soon": "Detalles del conjunto de datos próximamente",
  "Learnings pending": "Aprendizajes pendientes",
  gives: "da",
  Records: "Registros",
  Variables: "Variables",
  "Project specification": "Ficha del proyecto",
  DETAILS: "DETALLES",
  PROBLEM: "PROBLEMA",
  OBJECTIVE: "OBJETIVO",
  REPOSITORY: "REPOSITORIO",
  DEMO: "DEMO",
  "Problem statement pending": "Planteamiento del problema pendiente",
  "Objective pending": "Objetivo pendiente",
  "Technologies to confirm": "Tecnologías por confirmar",
  "View repository": "Ver repositorio",
  "Repository link pending": "Enlace al repositorio pendiente",
  "Open demo": "Abrir demo",
  "No public demo": "Sin demo pública",
  "Captures & visualisations": "Capturas y visualizaciones",
  added: "agregadas",
  "Files & source code": "Archivos y código fuente",
  "Source files coming soon": "Archivos fuente próximamente",
  "More projects": "Más proyectos",
  Previous: "Anterior",
  Next: "Siguiente",
  "[ CAPTURE PENDING ]": "[ CAPTURA PENDIENTE ]",
  "Screenshot coming soon": "Captura próximamente",

  
// PROJECT 01 — LINEAR REGRESSION

// Descripción
"A supervised Machine Learning project that analyzes the relationship between study hours and academic scores using linear regression and predictive modeling.":
  "Proyecto de Machine Learning supervisado que analiza la relación entre las horas de estudio y las calificaciones académicas mediante regresión lineal y modelado predictivo.",

// Problema y objetivo
"How can study hours be used to estimate academic scores through a supervised learning model?":
  "¿Cómo pueden utilizarse las horas de estudio para estimar calificaciones académicas mediante un modelo de aprendizaje supervisado?",

"Develop a linear regression model capable of estimating academic scores, validating user input and visualizing predictions.":
  "Desarrollar un modelo de regresión lineal capaz de estimar calificaciones académicas, validar entradas del usuario y visualizar predicciones.",

// Methodology
"Prepare a dataset containing 30 paired observations.":
  "Preparar un conjunto de datos con 30 observaciones emparejadas.",

"Define study hours as the independent variable and scores as the dependent variable.":
  "Definir las horas de estudio como variable independiente y las calificaciones como variable dependiente.",

"Train a Linear Regression model using scikit-learn.":
  "Entrenar un modelo de regresión lineal utilizando scikit-learn.",

"Evaluate model fit using R² and Mean Squared Error.":
  "Evaluar el ajuste del modelo mediante R² y el error cuadrático medio.",

"Validate user input and generate predictions within the dataset range.":
  "Validar las entradas del usuario y generar predicciones dentro del rango del conjunto de datos.",

"Visualize the observed data and fitted regression line.":
  "Visualizar los datos observados y la recta de regresión ajustada.",

// Implementation
"Organize the dataset using a Pandas DataFrame.":
  "Organizar el conjunto de datos mediante un DataFrame de Pandas.",

"Calculate the regression coefficients using scikit-learn.":
  "Calcular los coeficientes de regresión utilizando scikit-learn.",

"Validate numerical input between 0.5 and 15 study hours.":
  "Validar entradas numéricas entre 0.5 y 15 horas de estudio.",

"Generate regression graphs using Matplotlib.":
  "Generar gráficas de regresión mediante Matplotlib.",

// Metrics
"Training error": "Error de entrenamiento",

// Results
"The model achieved an R² of 0.99896 on the training dataset.":
  "El modelo obtuvo un R² de 0.99896 sobre el conjunto de entrenamiento.",

"The mean squared error was approximately 0.634.":
  "El error cuadrático medio fue aproximadamente 0.634.",

"An input of 8 study hours produces a predicted score of 55.62.":
  "Una entrada de 8 horas de estudio genera una calificación estimada de 55.62.",

"Input validation prevents predictions outside the supported range.":
  "La validación de entradas evita predicciones fuera del rango permitido.",

"The dataset is illustrative and the predictions are intended for educational purposes.":
  "El conjunto de datos es ilustrativo y las predicciones tienen fines educativos.",

// Interactive prediction
"Interactive prediction": "Predicción interactiva",
"Study hours": "Horas de estudio",

"Educational prediction based on illustrative training data.":
  "Predicción educativa basada en datos de entrenamiento ilustrativos.",

// Dataset
"Study hours and academic score":
  "Horas de estudio y calificación académica",

// Captures
"Study hours vs. score with the fitted regression line":
  "Horas de estudio frente a calificación con la recta de regresión ajustada",

"Scatter plot of study hours, academic scores and the fitted regression line":
  "Gráfico de dispersión de horas de estudio, calificaciones académicas y recta de regresión ajustada",

"Regression visualization":
  "Visualización de la regresión",

// Learnings
"Understand the fundamentals of supervised learning.":
  "Comprender los fundamentos del aprendizaje supervisado.",

"Implement Linear Regression using scikit-learn.":
  "Implementar regresión lineal utilizando scikit-learn.",

"Identify independent and dependent variables.":
  "Identificar variables independientes y dependientes.",

"Interpret regression coefficients, R² and MSE.":
  "Interpretar los coeficientes de regresión, R² y MSE.",

"Validate user input and avoid unsupported extrapolation.":
  "Validar las entradas del usuario y evitar extrapolaciones fuera del rango permitido.",

"Visualize numerical relationships using Matplotlib.":
  "Visualizar relaciones numéricas utilizando Matplotlib.",

"Recognize the limitations of illustrative training data.":
  "Reconocer las limitaciones de los datos de entrenamiento ilustrativos.",

  // PROJECT 02 — RACE MAZE

  // Identidad del proyecto
  "Race Maze": "Race Maze",
  "Algorithms · Game Development": "Algoritmos · Desarrollo de videojuegos",
  "GRAPH ALGORITHMS": "ALGORITMOS DE GRAFOS",
  "Pixel Circuit": "Pixel Circuit",

  // Descripción general
  "An interactive pixel-art racing game that combines procedural maze generation, graph traversal algorithms, vehicle customization and progressive difficulty.":
    "Un videojuego interactivo de carreras con gráficos pixel art que combina generación procedural de laberintos, algoritmos de recorrido de grafos, personalización de vehículos y dificultad progresiva.",

  // Problema y objetivo
  "How can graph algorithms be applied to generate randomized circuits and calculate efficient routes in an interactive game?":
    "¿Cómo se pueden aplicar los algoritmos de grafos para generar circuitos aleatorios y calcular rutas eficientes en un videojuego interactivo?",

  "Develop a browser-based racing game using DFS for procedural maze generation and BFS for shortest-path calculations.":
    "Desarrollar un videojuego de carreras para navegador utilizando DFS para la generación procedural de laberintos y BFS para calcular rutas más cortas.",

  // How it works
  "Generate randomized maze layouts using Depth-First Search (DFS).":
    "Generar laberintos aleatorios mediante búsqueda en profundidad (DFS).",

  "Calculate shortest paths between accessible cells using Breadth-First Search (BFS).":
    "Calcular las rutas más cortas entre celdas accesibles mediante búsqueda en anchura (BFS).",

  "Navigate the circuit, collect coins and unlock the finish line.":
    "Recorrer el circuito, recolectar monedas y desbloquear la línea de meta.",

  "Progress through increasingly challenging levels.":
    "Avanzar a través de niveles de dificultad creciente.",

  // Implementation
  "Build the game interface, garage and menus using HTML and CSS.":
    "Construir la interfaz del videojuego, el garaje y los menús utilizando HTML y CSS.",

  "Implement procedural maze generation and collision detection with JavaScript.":
    "Implementar la generación procedural de laberintos y la detección de colisiones con JavaScript.",

  "Render pixel-art vehicles and circuits using the Canvas 2D API.":
    "Renderizar vehículos y circuitos con gráficos pixel art utilizando Canvas 2D API.",

  "Implement keyboard controls, touchscreen support and optional route assistance.":
    "Implementar controles de teclado, compatibilidad con pantallas táctiles y asistencia de rutas opcional.",

  // Key figures
  "Vehicles": "Vehículos",
  "Selectable car models": "Modelos de vehículos seleccionables",
  "Teams": "Escuderías",
  "Racing color palettes": "Paletas de colores de competición",
  "Algorithms": "Algoritmos",
  "DFS and BFS": "DFS y BFS",

  // Results
  "Developed a playable racing game with procedurally generated circuits.":
    "Desarrollo de un videojuego de carreras funcional con circuitos generados proceduralmente.",

  "Implemented optional shortest-path assistance using BFS.":
    "Implementación de asistencia opcional de rutas más cortas mediante BFS.",

  "Integrated vehicle customization, coin collection, a timer and level progression.":
    "Integración de personalización de vehículos, recolección de monedas, cronómetro y progresión de niveles.",

  "Created a responsive experience without external frameworks or game engines.":
    "Creación de una experiencia adaptable sin frameworks externos ni motores de videojuegos.",

  // Prediction
  "Algorithm workflow": "Flujo de algoritmos",
  "Generation": "Generación",
  "Pathfinding": "Búsqueda de rutas",
  "Procedural maze generation":
  "Generación procedural de laberintos",
  "Shortest-path calculation":
  "Cálculo de la ruta más corta",

  // Dataset
  "Data Structure": "Estructura de datos",
  "Source": "Origen",
  "Elements": "Elementos",
  "Dynamically generated": "Generados dinámicamente",
  "Grid cells, walls, coins and positions":
  "Celdas, muros, monedas y posiciones",

  // Game Mechanics
  "Game Mechanics": "Mecánicas del juego",
  "Maze generation": "Generación de laberintos",
  "Randomized DFS": "DFS aleatorizado",
  "Route assistance": "Asistencia de rutas",
  "Progression": "Progresión",
  "Increasing difficulty": "Dificultad creciente",
  "Controls": "Controles",
  "Keyboard & touchscreen": "Teclado y pantalla táctil",
  "Collect coins and reach the finish line":
    "Recolectar monedas y alcanzar la meta",

  // Captures & visualisations
  "Gameplay demonstration": "Demostración del videojuego",
  "Race Maze gameplay demonstration":
    "Demostración del funcionamiento de Race Maze",

  "Garage and vehicle customization":
    "Garaje y personalización de vehículos",

  "Car and Circuit Design during the game":
    "Carro y circuito durante el juego",

  "Maze generation and BFS pathfinding":
    "Generación de laberintos y búsqueda de rutas mediante BFS",

  // What I learned
  "Understand graph traversal algorithms.":
    "Comprender los algoritmos de recorrido de grafos.",

  "Apply DFS to procedural generation.":
    "Aplicar DFS a la generación procedural.",

  "Use BFS for shortest-path calculations.":
    "Utilizar BFS para calcular rutas más cortas.",

  "Manage game states and event-driven interactions.":
    "Gestionar estados del videojuego e interacciones basadas en eventos.",

  "Render interactive graphics using the Canvas 2D API.":
    "Renderizar gráficos interactivos mediante Canvas 2D API.",

  "Implement responsive keyboard and touchscreen controls.":
    "Implementar controles adaptables de teclado y pantalla táctil.",

  
// PROJECT 03 — ACADEMIC HABITS

"Academic Habits": "Hábitos académicos",

"An academic Machine Learning project exploring student study habits, behavioral clustering and academic outcome classification using synthetic data.":
  "Proyecto académico de Machine Learning que explora hábitos de estudio, agrupaciones de comportamiento y clasificación de resultados académicos mediante datos sintéticos.",

"How can Machine Learning identify study habit patterns and classify academic outcomes?":
  "¿Cómo puede el Machine Learning identificar patrones de estudio y clasificar resultados académicos?",

"Analyze synthetic student records using K-Means clustering and KNN classification.":
  "Analizar registros sintéticos de estudiantes utilizando agrupamiento K-Means y clasificación KNN.",

// Methodology
"Generate 500 synthetic student records using a fixed random seed.":
  "Generar 500 registros sintéticos de estudiantes utilizando una semilla aleatoria fija.",

"Explore the relationship between study habits and academic performance.":
  "Explorar la relación entre los hábitos de estudio y el rendimiento académico.",

"Standardize the features and compare K-Means with three and four clusters.":
  "Estandarizar las variables y comparar K-Means con tres y cuatro grupos.",

"Train a KNN classifier using a stratified 75/25 train-test split.":
  "Entrenar un clasificador KNN utilizando una división estratificada de entrenamiento y prueba del 75/25.",

"Evaluate model performance and compare different neighbor counts.":
  "Evaluar el rendimiento del modelo y comparar diferentes cantidades de vecinos.",

// Implementation
"Generate and prepare synthetic data using NumPy and Pandas.":
  "Generar y preparar datos sintéticos mediante NumPy y Pandas.",

"Implement K-Means clustering and PCA visualizations.":
  "Implementar agrupamiento K-Means y visualizaciones mediante PCA.",

"Build a KNN classification pipeline with feature scaling.":
  "Construir un pipeline de clasificación KNN con escalado de variables.",

"Evaluate accuracy, silhouette scores and confusion matrices.":
  "Evaluar exactitud, puntuaciones de silueta y matrices de confusión.",

"Compare seven values of k with and without feature scaling.":
  "Comparar siete valores de k con y sin escalado de variables.",

// Metrics
"Dataset": "Conjunto de datos",
"Synthetic student records": "Registros sintéticos de estudiantes",
"Accuracy": "Exactitud",
"Scaled KNN · k = 5": "KNN escalado · k = 5",
"Silhouette": "Silueta",

// Results
"Three clusters achieved a higher silhouette score than four clusters.":
  "Tres grupos obtuvieron una puntuación de silueta superior a cuatro grupos.",

"KNN achieved 81.6% accuracy with scaled features and 77.6% without scaling.":
  "KNN alcanzó una exactitud del 81.6 % con escalado y del 77.6 % sin escalado.",

"Feature scaling improved baseline classification accuracy by 4 percentage points.":
  "El escalado de variables mejoró la exactitud del modelo base en 4 puntos porcentuales.",

"The results are specific to synthetic data and should not be used to assess real students.":
  "Los resultados corresponden a datos sintéticos y no deben utilizarse para evaluar estudiantes reales.",

// Dataset
"Study hours, attendance, assignments, grade and result":
  "Horas de estudio, asistencia, tareas, calificación y resultado",

// Model evaluation
"Model evaluation": "Evaluación de modelos",
"Classification accuracy": "Exactitud de clasificación",
"Scaled features": "Variables escaladas",
"Unscaled features": "Variables sin escalar",
"Improvement with feature scaling":
  "Mejora mediante escalado de variables",
"Silhouette score": "Puntuación de silueta",
"3 clusters": "3 grupos",
"4 clusters": "4 grupos",
"Evaluation on synthetic academic data.":
  "Evaluación sobre datos académicos sintéticos.",

// Captures
"K-Means: three vs four clusters":
  "K-Means: tres frente a cuatro grupos",

"Comparison of K-Means clustering solutions":
  "Comparación de soluciones de agrupamiento K-Means",

"KNN confusion matrix":
  "Matriz de confusión de KNN",

"KNN classification confusion matrix":
  "Matriz de confusión de la clasificación KNN",

"KNN accuracy and feature scaling":
  "Exactitud de KNN y escalado de variables",

"Comparison of KNN accuracy across neighbor counts":
  "Comparación de la exactitud de KNN según la cantidad de vecinos",

"Exploratory data analysis":
  "Análisis exploratorio de datos",

"Study habits and academic grades":
  "Hábitos de estudio y calificaciones académicas",

// Files
"Dataset (.csv)": "Conjunto de datos (.csv)",

// Learnings
"Generate and analyze reproducible synthetic datasets.":
  "Generar y analizar conjuntos de datos sintéticos reproducibles.",

"Understand supervised and unsupervised learning.":
  "Comprender el aprendizaje supervisado y no supervisado.",

"Evaluate clustering quality using silhouette scores.":
  "Evaluar la calidad del agrupamiento mediante puntuaciones de silueta.",

"Apply PCA for two-dimensional visualizations.":
  "Aplicar PCA para visualizaciones bidimensionales.",

"Understand the importance of feature scaling in KNN.":
  "Comprender la importancia del escalado de variables en KNN.",

"Evaluate classification models using accuracy and confusion matrices.":
  "Evaluar modelos de clasificación mediante exactitud y matrices de confusión.",

"Recognize the limitations of synthetic data and model evaluation.":
  "Reconocer las limitaciones de los datos sintéticos y de la evaluación de modelos.",


// PROJECT 04 — COMMERCIAL HOTSPOTS

"Commercial Hotspots": "Hotspots Comerciales",
"Hotspots": "Hotspots",
"Geospatial Analysis · Machine Learning":
  "Análisis geoespacial · Machine Learning",

"GEOSPATIAL ANALYSIS": "ANÁLISIS GEOESPACIAL",
"November 2026": "Noviembre de 2026",

// Descripción
"A geospatial analysis project that combines Machine Learning, demographic data and road network analysis to evaluate potential automotive dealership locations in San Salvador, El Salvador.":
  "Proyecto de análisis geoespacial que combina Machine Learning, datos demográficos y análisis de redes viales para evaluar posibles ubicaciones de concesionarios de automóviles en San Salvador, El Salvador.",

// Problema y objetivo
"How can geographic data and Machine Learning support the evaluation of potential commercial locations?":
  "¿Cómo pueden los datos geográficos y el Machine Learning contribuir a la evaluación de posibles ubicaciones comerciales?",

"Identify geographic clusters of automotive dealerships and compare three proposed business locations using spatial, demographic and accessibility indicators.":
  "Identificar agrupaciones geográficas de concesionarios de automóviles y comparar tres ubicaciones comerciales propuestas mediante indicadores espaciales, demográficos y de accesibilidad.",

// How it works
"Collect automotive dealership locations from OpenStreetMap using Overpass Turbo.":
  "Recopilar ubicaciones de concesionarios de automóviles desde OpenStreetMap mediante Overpass Turbo.",

"Clean and audit geographic records before training the models.":
  "Limpiar y auditar los registros geográficos antes de entrenar los modelos.",

"Apply K-Means to identify geographic concentrations of dealerships.":
  "Aplicar K-Means para identificar concentraciones geográficas de concesionarios.",

"Classify three proposed locations using K-Nearest Neighbors.":
  "Clasificar tres ubicaciones propuestas utilizando K-Nearest Neighbors.",

"Integrate population data, district boundaries and road accessibility.":
  "Integrar datos de población, límites distritales y accesibilidad vial.",

"Compare commercial locations through an interactive dashboard.":
  "Comparar ubicaciones comerciales mediante un dashboard interactivo.",

// Implementation
"Build a Python pipeline for geographic data preparation and analysis.":
  "Construir un pipeline en Python para la preparación y el análisis de datos geográficos.",

"Evaluate K-Means clustering using silhouette scores and minimum cluster sizes.":
  "Evaluar el agrupamiento K-Means mediante puntuaciones de silueta y tamaños mínimos de los grupos.",

"Implement KNN classification with leave-one-out evaluation.":
  "Implementar la clasificación KNN con evaluación leave-one-out.",

"Analyze road network distances using OSMnx.":
  "Analizar distancias de la red vial utilizando OSMnx.",

"Integrate demographic and geographic information using GeoPandas.":
  "Integrar información demográfica y geográfica mediante GeoPandas.",

"Develop an interactive frontend using React, TypeScript and Leaflet.":
  "Desarrollar un frontend interactivo utilizando React, TypeScript y Leaflet.",

// Metrics
"Training records": "Registros de entrenamiento",
"From 30 original OSM records":
  "De 30 registros originales de OSM",

"LOO agreement": "Acuerdo LOO",

// Results
"Identified two geographic clusters containing 9 and 12 dealerships.":
  "Se identificaron dos agrupaciones geográficas de 9 y 12 concesionarios.",

"Classified locations A and C into Zone 1 and location B into Zone 2.":
  "Se clasificaron las ubicaciones A y C en la Zona 1 y la ubicación B en la Zona 2.",

"Achieved 95.2% leave-one-out agreement with K-Means labels.":
  "Se obtuvo un acuerdo leave-one-out del 95.2 % con las etiquetas de K-Means.",

"Location C was selected as the preliminary preferred alternative.":
  "La ubicación C fue seleccionada como alternativa preliminar preferida.",

"The analysis supports exploratory decision-making but does not predict commercial profitability.":
  "El análisis contribuye a la toma de decisiones exploratoria, pero no predice la rentabilidad comercial.",

// Dataset
"30 original / 21 training":
  "30 originales / 21 de entrenamiento",

"Name, category, latitude and longitude":
  "Nombre, categoría, latitud y longitud",

// Location comparison
"Location comparison": "Comparación de ubicaciones",
"Zone": "Zona",
"Within 1 km": "Dentro de 1 km",
"Within 2 km": "Dentro de 2 km",
"Competitors within 2 km": "Competidores dentro de 2 km",

"Preliminary preferred alternative":
  "Alternativa preliminar preferida",

"Location C": "Ubicación C",

"Competitor counts based on straight-line distances.":
  "Conteo de competidores basado en distancias en línea recta.",

// Captures
"Interactive geospatial dashboard":
  "Dashboard geoespacial interactivo",

"Commercial Hotspots interactive dashboard":
  "Dashboard interactivo de Hotspots Comerciales",

"K-Means geographic clustering":
  "Agrupamiento geográfico mediante K-Means",

"Geographic clusters of automotive dealerships":
  "Agrupaciones geográficas de concesionarios de automóviles",

"KNN location classification":
  "Clasificación de ubicaciones mediante KNN",

"Classification of proposed commercial locations":
  "Clasificación de ubicaciones comerciales propuestas",

"Commercial location comparison":
  "Comparación de ubicaciones comerciales",

"Comparison of locations A, B and C":
  "Comparación de las ubicaciones A, B y C",

"Dashboard demonstration":
  "Demostración del dashboard",

"Interactive dashboard demonstration":
  "Demostración del dashboard interactivo",

// Files
"Python backend": "Backend en Python",
"React frontend": "Frontend en React",
"Model results": "Resultados del modelo",
"OpenStreetMap dataset": "Dataset de OpenStreetMap",

// Learnings
"Collect and validate open geographic data.":
  "Recopilar y validar datos geográficos abiertos.",

"Apply Machine Learning to spatial analysis.":
  "Aplicar Machine Learning al análisis espacial.",

"Evaluate clustering quality and model consistency.":
  "Evaluar la calidad del agrupamiento y la consistencia del modelo.",

"Distinguish straight-line distances from road network distances.":
  "Diferenciar las distancias en línea recta de las distancias por la red vial.",

"Integrate demographic and geographic datasets.":
  "Integrar conjuntos de datos demográficos y geográficos.",

"Connect Python analysis with an interactive React frontend.":
  "Conectar el análisis realizado en Python con un frontend interactivo en React.",

"Recognize the limitations of exploratory commercial analysis.":
  "Reconocer las limitaciones del análisis comercial exploratorio.",


// PROJECT 05 — PERSONAL PORTFOLIO

"Personal Portfolio": "Portafolio personal",
"Portfolio": "Portafolio",
"Full-Stack Web Development": "Desarrollo web Full Stack",

// Descripción
"A full-stack personal portfolio combining a professional showcase, an interactive creative environment, immersive animations, bilingual content and a server-side contact API.":
  "Portafolio personal Full Stack que combina una presentación profesional, un entorno creativo interactivo, animaciones inmersivas, contenido bilingüe y una API de contacto del lado del servidor.",

// Problema y objetivo
"How can a personal website communicate technical skills, professional experience and creative identity through a unified digital experience?":
  "¿Cómo puede un sitio web personal comunicar habilidades técnicas, experiencia profesional e identidad creativa mediante una experiencia digital unificada?",

"Develop a responsive, bilingual and maintainable portfolio that integrates frontend development, server-side functionality and interactive visual experiences.":
  "Desarrollar un portafolio adaptable, bilingüe y mantenible que integre desarrollo frontend, funcionalidades del servidor y experiencias visuales interactivas.",

// How it works
"Design a consistent visual identity for the professional and creative experiences.":
  "Diseñar una identidad visual coherente para las experiencias profesional y creativa.",

"Organize routes, layouts and reusable components using the Next.js App Router.":
  "Organizar rutas, layouts y componentes reutilizables mediante Next.js App Router.",

"Centralize editable content in TypeScript data files.":
  "Centralizar el contenido editable en archivos de datos TypeScript.",

"Integrate three-dimensional animations and interactive elements.":
  "Integrar animaciones tridimensionales y elementos interactivos.",

"Implement a shared English and Spanish language system.":
  "Implementar un sistema compartido de idiomas inglés y español.",

"Process contact requests through a server-side API.":
  "Procesar solicitudes de contacto mediante una API del lado del servidor.",

// Implementation
"Build the professional portfolio using Next.js, React and TypeScript.":
  "Construir el portafolio profesional utilizando Next.js, React y TypeScript.",

"Create a cinematic introduction using Three.js and Motion.":
  "Crear una introducción cinematográfica utilizando Three.js y Motion.",

"Develop Walter's World as an independent React and Vite application.":
  "Desarrollar Walter's World como una aplicación independiente con React y Vite.",

"Integrate interactive music, writing and creative experiences.":
  "Integrar experiencias interactivas de música, escritura y creatividad.",

"Implement POST /api/contact with shared Zod validation.":
  "Implementar POST /api/contact con validación compartida mediante Zod.",

"Add basic spam protection, rate limiting and email delivery integration.":
  "Agregar protección básica contra spam, limitación de solicitudes e integración de envío de correos.",

"Document the project structure and content maintenance process.":
  "Documentar la estructura del proyecto y el proceso de mantenimiento del contenido.",

// Metrics
"Experiences": "Experiencias",
"Professional and creative": "Profesional y creativa",
"Languages": "Idiomas",
"English and Spanish": "Inglés y español",
"API endpoint": "Endpoint de API",
"Server-side contact API": "API de contacto del servidor",

// Results
"Developed a responsive professional portfolio with reusable components.":
  "Se desarrolló un portafolio profesional adaptable con componentes reutilizables.",

"Integrated Walter's World as an independent interactive experience.":
  "Se integró Walter's World como una experiencia interactiva independiente.",

"Implemented bilingual navigation and content across both applications.":
  "Se implementaron navegación y contenido bilingües en ambas aplicaciones.",

"Created a cinematic introduction and interactive visual effects.":
  "Se creó una introducción cinematográfica y efectos visuales interactivos.",

"Implemented a contact API with server-side validation and basic spam protection.":
  "Se implementó una API de contacto con validación del servidor y protección básica contra spam.",

"Established a maintainable architecture for adding future projects and content.":
  "Se estableció una arquitectura mantenible para incorporar futuros proyectos y contenido.",

// System architecture
"System architecture": "Arquitectura del sistema",
"Client": "Cliente",
"Web browser": "Navegador web",
"Professional portfolio": "Portafolio profesional",
"Contact request flow": "Flujo de solicitudes de contacto",
"Validation and spam protection":
  "Validación y protección contra spam",
"Email delivery when configured":
  "Envío de correos cuando está configurado",

// Content architecture
"Content Architecture": "Arquitectura de contenido",
"Storage": "Almacenamiento",
"Content": "Contenido",
"TypeScript content files": "Archivos de contenido TypeScript",
"Projects, profile, skills, certificates and albums":
  "Proyectos, perfil, habilidades, certificados y álbumes",

// Captures
"Professional portfolio homepage":
  "Página principal del portafolio profesional",

"Walter's World": "Walter's World",

"Interactive creative environment":
  "Entorno creativo interactivo",

"Project architecture":
  "Arquitectura del proyecto",

"Portfolio source code organization":
  "Organización del código fuente del portafolio",

"Contact API request and response":
  "Solicitud y respuesta de la API de contacto",

"Server-side contact endpoint demonstration":
  "Demostración del endpoint de contacto del servidor",

"Portfolio demonstration":
  "Demostración del portafolio",

"Professional portfolio and creative world demonstration":
  "Demostración del portafolio profesional y mundo creativo",

// Learnings
"Develop full-stack applications using Next.js.":
  "Desarrollar aplicaciones Full Stack utilizando Next.js.",

"Organize reusable and maintainable React components.":
  "Organizar componentes React reutilizables y mantenibles.",

"Implement server-side validation and API responses.":
  "Implementar validaciones del servidor y respuestas de API.",

"Create immersive interfaces using three-dimensional graphics.":
  "Crear interfaces inmersivas mediante gráficos tridimensionales.",

"Manage multilingual content across independent applications.":
  "Gestionar contenido multilingüe entre aplicaciones independientes.",

"Optimize responsive interfaces and visual assets.":
  "Optimizar interfaces adaptables y recursos visuales.",

"Separate application logic from editable content.":
  "Separar la lógica de la aplicación del contenido editable.",


  /* ---------- skills ---------- */
  Programming: "Programación",
  "AI / Machine Learning": "IA / Machine Learning",
  "Tools & Platforms": "Herramientas y plataformas",
  "Soft Skills": "Habilidades blandas",
  "ML activities (to confirm)": "Actividades de ML (por confirmar)",
  "This portfolio": "Este portafolio",
  "React components": "Componentes de React",
  "Next.js · App Router": "Next.js · App Router",
  "REST APIs": "APIs REST",
  "Input validation · Zod": "Validación de datos · Zod",
  "Contact form": "Formulario de contacto",
  "Linear regression": "Regresión lineal",
  "Decision trees": "Árboles de decisión",
  "K-Means clustering": "Agrupamiento K-Means",
  "Project 01": "Proyecto 01",
  "Project 02": "Proyecto 02",
  "Project 03": "Proyecto 03",
  "Project 04": "Proyecto 04",
  "MOS track (to confirm)": "Ruta MOS (por confirmar)",
  "Hotspot analysis": "Análisis de zonas",
  "Data visualisation": "Visualización de datos",
  "Course activities": "Actividades del curso",
  "Version control": "Control de versiones",
  Repositories: "Repositorios",
  Deployment: "Despliegue",
  "to confirm": "por confirmar",
  "English · B1 (TOEIC)": "Inglés · B1 (TOEIC)",
  "Continuous learning": "Aprendizaje continuo",
  "Data Analysis": "Análisis de datos",
  "Web Development": "Desarrollo web",
  "10-week course": "Curso de 10 semanas",

  /* ---------- education & credentials ---------- */
  "Spelling Bee Champion":
  "Campeón de Spelling Bee",

"Winner of the 2026 Spelling Bee competition in the Senior category.":
  "Ganador de la competencia de deletreo en inglés 2026, categoría Senior.",
"Secondary school": "Bachillerato",
"Program": "Programa",
"Bachillerato General": "Bachillerato General",
"Programa ¡Supérate!": "Programa ¡Supérate!",
"Academic preparation for higher education.":
  "Preparación académica para la educación superior.",
"Complementary education in English, information technology, programming, leadership and personal development.":
  "Formación complementaria en inglés, tecnologías de la información, programación, liderazgo y desarrollo personal.",
  Credential: "Credencial",
  "Previous credential": "Credencial anterior",
  "Next credential": "Credencial siguiente",
  "Certifications and achievements": "Certificaciones y logros",
  "— open larger view": "— abrir vista ampliada",
  "Verify on Credly": "Verificar en Credly",
  "Verify credential": "Verificar credencial",
  "(opens in a new tab)": "(se abre en una pestaña nueva)",
  Issuer: "Emisor",
  Date: "Fecha",
  Year: "Año",
  "Badge ID": "ID de la insignia",
  "No online verification available for this document.": "Este documento no tiene verificación en línea.",
  Close: "Cerrar",
  "Image coming soon": "Imagen próximamente",
  All: "Todas",
  Extracurricular: "Extracurricular",
  "Microsoft certification": "Certificación de Microsoft",
  "TOEIC Listening & Reading — Silver": "TOEIC Listening & Reading — Plata",
  "TOEIC Listening & Reading — Bronze": "TOEIC Listening & Reading — Bronce",
  "Diploma for achieving a Silver TOEIC Listening & Reading result in 2025.":
    "Diploma por obtener un resultado Plata en TOEIC Listening & Reading en 2025.",
  "Diploma for achieving a Bronze TOEIC Listening & Reading result in 2024.":
    "Diploma por obtener un resultado Bronce en TOEIC Listening & Reading en 2024.",
  "Program diploma issued by the center — not the official ETS score report.":
    "Diploma del programa emitido por el centro; no es el reporte oficial de puntaje de ETS.",
  "Empower Youth — First edition": "Empower Youth — Primera edición",
  "November 28, 2024 · La Libertad, Antiguo Cuscatlán": "28 de noviembre de 2024 · La Libertad, Antiguo Cuscatlán",
  "Completed the first edition of the Empower Youth course, a program designed to develop leadership skills and an interest in entrepreneurship.":
    "Completé la primera edición del curso Empower Youth, un programa diseñado para desarrollar habilidades de liderazgo y el interés por el emprendimiento.",
  "WRO El Salvador · National Robotics Olympiad": "WRO El Salvador · Olimpiada Nacional de Robótica",
  "August 31, 2024 · San Salvador": "31 de agosto de 2024 · San Salvador",
  "Participation diploma in the RoboMission challenge, Junior category.":
    "Diploma de participación en el desafío RoboMission, categoría Junior.",
  "Extracurricular Clubs 2023": "Clubes Extracurriculares 2023",
  "Recognition diploma for participating in the 2023 extracurricular clubs (with USAID).":
    "Diploma de reconocimiento por participar en los clubes extracurriculares 2023 (con USAID).",

  /* ---------- music ---------- */
  "Listen to": "Escuchar",
  "Listen on Spotify": "Escuchar en Spotify",
  "Listen on Apple Music": "Escuchar en Apple Music",
  "Close listening options": "Cerrar opciones de escucha",
  "Album covers": "Portadas de álbumes",
  "Album covers. Use the arrow keys to browse and Enter to open an album.":
    "Portadas de álbumes. Usa las flechas para recorrerlas y Enter para abrir un álbum.",

  /* ---------- Walter's World ---------- */
  "Creative area": "Área creativa",
  "CREATIVE AREA": "ÁREA CREATIVA",
  "An illustrated, interactive Japanese garage with my projects, music and certificates.":
    "Un garaje japonés ilustrado e interactivo con mis proyectos, mi música y mis certificados.",

  /* ---------- contact ---------- */
  "Email address coming soon": "Correo próximamente",
  Name: "Nombre",
  Email: "Correo",
  Message: "Mensaje",
  "Sending message": "Enviando mensaje",
  "Send message": "Enviar mensaje",
  "Couldn't reach the server. Check your connection and try again.":
    "No se pudo conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.",
  "Enter your name (at least 2 characters).": "Escribe tu nombre (al menos 2 caracteres).",
  "Name must be 80 characters or fewer.": "El nombre debe tener 80 caracteres o menos.",
  "Enter a valid email address, like name@domain.com.": "Escribe un correo válido, como nombre@dominio.com.",
  "Email must be 160 characters or fewer.": "El correo debe tener 160 caracteres o menos.",
  "Write a message of at least 10 characters.": "Escribe un mensaje de al menos 10 caracteres.",
  "Message must be 2000 characters or fewer.": "El mensaje debe tener 2000 caracteres o menos.",
  "Some fields need attention.": "Algunos campos necesitan revisión.",
  "Message received.": "Mensaje recibido.",
  "Message sent. Thanks for writing.": "Mensaje enviado. Gracias por escribir.",
  "The message couldn't be delivered. Try again later.": "No se pudo entregar el mensaje. Inténtalo más tarde.",
  "Too many messages from this connection. Try again in a few minutes.":
    "Demasiados mensajes desde esta conexión. Inténtalo de nuevo en unos minutos.",
  "Your message is valid, but email delivery isn't switched on yet, so it was not sent.":
    "Tu mensaje es válido, pero el envío de correos aún no está activado, así que no se envió.",
  "The request body must be valid JSON.": "El cuerpo de la petición debe ser JSON válido.",
  "The request body must be a JSON object.": "El cuerpo de la petición debe ser un objeto JSON.",

  /* ---------- footer, links, misc ---------- */
  INDEX: "ÍNDICE",
  ELSEWHERE: "EN OTROS SITIOS",
  "Built with Next.js, TypeScript and Tailwind CSS": "Hecho con Next.js, TypeScript y Tailwind CSS",
  "profile coming soon": "perfil próximamente",
  "link pending": "enlace pendiente",
  "Pending — to be added": "Pendiente: por agregar",
  "Page not found": "Página no encontrada",
  "This address doesn’t match any page in the portfolio.": "Esta dirección no corresponde a ninguna página del portafolio.",
  "Back to the home page": "Volver a la página de inicio",

  // Colecciones de proyectos, carrusel y botón de contacto
  "Academic Projects": "Proyectos académicos",
  "Independent Projects": "Proyectos independientes",
  "Independent Projects.": "Proyectos independientes.",
  "Independent Work": "Trabajo independiente",
  "Artificial Intelligence": "Inteligencia artificial",
  "Software Engineering": "Ingeniería de software",
  "Artificial Intelligence, Machine Learning & Software Engineering.": "Inteligencia artificial, aprendizaje automático e ingeniería de software.",
  "Independent work driven by curiosity, engineering and experimentation.": "Trabajo independiente impulsado por la curiosidad, la ingeniería y la experimentación.",
  "View project": "Ver proyecto",
  "Prototype": "Prototipo",
  "PROTOTYPE": "PROTOTIPO",
  "Hardware & Automation": "Hardware y automatización",
  "Sending...": "Enviando...",
  "Sent": "Enviado",
  "Try again": "Reintentar",
  "Collection 01": "Colección 01",
  "Collection 02": "Colección 02",
  "Previous project": "Proyecto anterior",
  "Next project": "Proyecto siguiente",
  "Choose a project": "Elegir un proyecto",
  "Project {n} of {total}": "Proyecto {n} de {total}",
  "Go to project {n}": "Ir al proyecto {n}",
  "Pause autoplay": "Pausar reproducción automática",
  "Resume autoplay": "Reanudar reproducción automática",
  "Technologies": "Tecnologías",
  "View details": "Ver detalles",
  "Project preview": "Vista previa del proyecto",
  "Image pending": "Imagen pendiente",
  "Status": "Estado",
  "Category": "Categoría",
  "Technologies to be documented": "Tecnologías por documentar",
  "Back to projects": "Volver a proyectos",
  "Independent project": "Proyecto independiente",
  "Repository": "Repositorio",
  "Demo": "Demo",
  "Details to be documented.": "Detalles por documentar.",

  // Proyectos independientes
  "3D Simulation · Physics": "Simulación 3D · Física",
  "Frontend Development": "Desarrollo frontend",
  "An educational 3D electromagnetic crane simulator with industrial controls, interactive physics visualizations and simulated telemetry.": "Simulador educativo 3D de una grúa electromagnética con controles industriales, visualizaciones interactivas de física y telemetría simulada.",
  "A collection of practical web development exercises covering HTML, CSS, JavaScript, React components and an interactive virtual pet.": "Colección de ejercicios prácticos de desarrollo web que abarca HTML, CSS, JavaScript, componentes React y una mascota virtual interactiva.",
  "Project overview": "Descripción del proyecto",
  "Developed for Expotecnia 42 — Instituto Emiliani. The simulator illustrates electromagnetic principles; telemetry is simplified and does not represent validated industrial measurements.": "Desarrollado para Expotecnia 42 — Instituto Emiliani. El simulador ilustra principios electromagnéticos; la telemetría es simplificada y no representa mediciones industriales validadas.",
  "An ongoing practice archive featuring CSS exercises, React applications and a GitHub Pages gallery of selected exercises.": "Archivo de prácticas en desarrollo que incluye ejercicios CSS, aplicaciones React y una galería de ejercicios seleccionados en GitHub Pages.",
  "All independent projects": "Todos los proyectos independientes",

  // walt.dev — proyectos independientes, visores interactivos y Machine Learning & Portfolio
  "Machine Learning & Portfolio": "Machine Learning y Portafolio",
  "Applied machine learning, data analysis and web development projects.": "Proyectos de machine learning aplicado, análisis de datos y desarrollo web.",
  "Machine learning projects": "Proyectos de machine learning",
  "Independent projects": "Proyectos independientes",
  "Filter credentials": "Filtrar credenciales",
  "Footer": "Pie de página",
  "Academic": "Académico",
  "Company": "Empresa",
  "Team project": "Proyecto en equipo",
  "Team development of SortlyScan, an environmental education platform that uses artificial intelligence to classify waste, presented at Expo Tech.": "Desarrollo en equipo de SortlyScan, una plataforma de educación ambiental que utiliza inteligencia artificial para clasificar residuos, presentada en Expo Tech.",
  "Took part in the original team project presented at Expo Tech.": "Participé en el proyecto original en equipo presentado en Expo Tech.",
  "Later redesigned and rebuilt the platform individually as an interactive 2.0 demo.": "Después rediseñé y reconstruí la plataforma de forma individual como una demostración interactiva 2.0.",
  "Original version presented at Expo Tech.": "Versión original presentada en Expo Tech.",
  "Interactive 2.0 demo published on GitHub Pages, with waste classification in the browser and fictional institutional data.": "Demostración interactiva 2.0 publicada en GitHub Pages, con clasificación de residuos en el navegador y datos institucionales ficticios.",
  "SortlyScan home page": "Página de inicio de SortlyScan",
  "HYDRA team presenting the rainwater harvesting prototype at Expo de Logros 2025": "Equipo de HYDRA presentando el prototipo de captación de agua de lluvia en Expo de Logros 2025",
  "Car and Circuit Design": "Diseño del auto y del circuito",
  "Vehicle and racing team selection": "Selección de vehículo y escudería",
  "Linear equation": "Ecuación lineal",
  "Model": "Modelo",
  "Model fit": "Ajuste del modelo",
  "Fullscreen": "Pantalla completa",
  "Exit fullscreen": "Salir de pantalla completa",
  "Fullscreen unavailable": "Pantalla completa no disponible",
  "Interactive demo": "Demostración interactiva",
  "Open in new tab": "Abrir en una pestaña nueva",
  "Open live demo": "Abrir demostración en vivo",
  "Live Demo": "Demostración en vivo",
  "Loading interactive demo…": "Cargando la demostración interactiva…",
  "If the demo does not load here, open it in a new tab.": "Si la demostración no carga aquí, ábrela en una pestaña nueva.",
  "Runs in the viewer on this page": "Se ejecuta en el visor de esta página",
  "Embedded Systems & IoT": "Sistemas embebidos e IoT",
  "An intelligent rainwater harvesting and storage system integrating embedded systems, sensors, automation, IoT and an interactive 3D digital twin.": "Sistema inteligente de captación y almacenamiento de agua de lluvia que integra sistemas embebidos, sensores, automatización, IoT y un gemelo digital 3D interactivo.",
  "Physical prototype (2025): developed as a team and presented at Expo de Logros. It monitors water level and pH with Arduino, controls the gates with servomotors, shows readings on an LCD and sends data to Firebase.": "Prototipo físico (2025): desarrollado en equipo y presentado en Expo de Logros. Mide el nivel del agua y el pH con Arduino, controla las compuertas con servomotores, muestra las lecturas en una pantalla LCD y envía los datos a Firebase.",
  "Digital twin (2026): an interactive 3D simulation of the system with water collection, four storage tanks, simulated indicators, a firmware viewer and a simulated serial monitor. It runs independently of the physical hardware.": "Gemelo digital (2026): simulación 3D interactiva del sistema con captación de agua, cuatro tanques de almacenamiento, indicadores simulados, un visor del firmware y un monitor serial simulado. Funciona de forma independiente del hardware físico.",
  "Software Development": "Desarrollo de software",
  "A collection of practical Python applications demonstrating programming fundamentals, data structures, input validation and file management.": "Colección de aplicaciones prácticas en Python que demuestran fundamentos de programación, estructuras de datos, validación de entradas y manejo de archivos.",
  "The interactive viewer runs the original exercises in the browser with Python (Pyodide), including the questions each program asks the user.": "El visor interactivo ejecuta los ejercicios originales en el navegador con Python (Pyodide), incluidas las preguntas que cada programa hace al usuario.",
  "File Handling": "Manejo de archivos",
  "Files": "Archivos",
  "EXPLORER": "EXPLORADOR",
  "TERMINAL": "TERMINAL",
  "Python source code": "Código fuente en Python",
  "Run": "Ejecutar",
  "Stop": "Detener",
  "Ready": "Listo",
  "Starting…": "Iniciando…",
  "Running": "En ejecución",
  "Waiting for input": "Esperando entrada",
  "Finished": "Finalizado",
  "Error": "Error",
  "Stopped": "Detenido",
  "Loading Python runtime…": "Cargando Python…",
  "Process stopped.": "Proceso detenido.",
  "Process finished.": "Proceso finalizado.",
  "Press Run to execute the selected application.": "Pulsa Ejecutar para correr la aplicación seleccionada.",
  "Program input": "Entrada del programa",
  "Enter": "Enviar",
  "applications": "aplicaciones",
  "Artificial Intelligence, EdTech & Sustainability": "Inteligencia artificial, EdTech y sostenibilidad",
  "AI-powered environmental education platform featuring waste classification, interactive learning, gamification and institutional analytics.": "Plataforma de educación ambiental impulsada por inteligencia artificial, con clasificación de residuos, aprendizaje interactivo, gamificación y analítica institucional.",
  "Original project (Expo Tech): developed as a team and presented at Expo Tech.": "Proyecto original (Expo Tech): desarrollado en equipo y presentado en Expo Tech.",
  "Interactive version 2.0 (2026): redesigned and rebuilt individually by Walter Santos. Waste images are classified directly in the browser with an ONNX model.": "Versión interactiva 2.0 (2026): rediseñada y reconstruida de forma individual por Walter Santos. Las imágenes de residuos se clasifican directamente en el navegador con un modelo ONNX.",
  "This version is an interactive demo with fictional institutional data. Sign-in, institutional management and data storage are demonstrations, not production services.": "Esta versión es una demostración interactiva con datos institucionales ficticios. El inicio de sesión, la gestión institucional y el almacenamiento de datos son demostraciones, no servicios en producción.",
  "The message is too large.": "El mensaje es demasiado grande.",
  "Collaborative development of an intelligent rainwater harvesting and storage system integrating embedded systems, electronics, automation and IoT to promote sustainable water management.": "Desarrollo colaborativo de un sistema inteligente de captación y almacenamiento de agua de lluvia que integra sistemas embebidos, electrónica, automatización e IoT para promover una gestión sostenible del agua.",
  "Collaborated in the design, development and construction of the physical prototype.": "Colaboré en el diseño, el desarrollo y la construcción del prototipo físico.",
  "Implemented Arduino-based programming for water level monitoring and automated gate control.": "Programé con Arduino el monitoreo del nivel del agua y el control automático de las compuertas.",
  "Contributed to the integration of electronic components, sensors and monitoring systems.": "Contribuí a la integración de componentes electrónicos, sensores y sistemas de monitoreo.",
  "Functional physical prototype presented at Expo de Logros 2025.": "Prototipo físico funcional presentado en Expo de Logros 2025.",
  "Automated water level monitoring and gate control using ultrasonic sensors and servomotors.": "Monitoreo automático del nivel del agua y control de compuertas con sensores ultrasónicos y servomotores.",
  "Real-time LCD visualization and firmware for pH monitoring and wireless data transmission.": "Visualización en tiempo real en pantalla LCD y firmware para el monitoreo del pH y la transmisión inalámbrica de datos.",
  "Interactive project viewer": "Visor interactivo de proyectos",
  "HYDRA interactive digital twin": "Gemelo digital interactivo de HYDRA",
  "About and identity": "Sobre mí e identidad",
  "About section": "Sección sobre mí",
  "Captured moments": "Momentos capturados",
  "Photo gallery in My World": "Galería de fotos en My World",
  "Music collection": "Colección musical",
  "Interactive album carousel": "Carrusel interactivo de álbumes",
  "Academic projects": "Proyectos académicos",
  "Academic practice": "Práctica académica",
  "Computer vision · ONNX": "Visión computacional · ONNX",
  "Geospatial analysis": "Análisis geoespacial",
  "Development environment": "Entorno de desarrollo",
  "Project demos": "Demostraciones de proyectos",
  "Teamwork": "Trabajo en equipo",
  "Collaborative projects": "Proyectos colaborativos",
  "Problem-solving": "Resolución de problemas",
  "Communication": "Comunicación",
  "Adaptability": "Adaptabilidad",
  "Completed the NAUFest 2026 #AIForImpact Challenge, developing a proposed solution to a real-world problem using artificial intelligence.": "Completó el Challenge #AIForImpact de NAUFest 2026, desarrollando una propuesta de solución a un problema real mediante inteligencia artificial.",
};
