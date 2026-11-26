// Datos de los proyectos del portafolio. Agregar un objeto aquí crea su tarjeta y su página.

import type { Project } from "@/types";

/**
 * Machine Learning & Portfolio (colección 01 de la sección de proyectos).
 *
 * Only facts already known are filled in. Everything specific to Walter's
 * own work (results, screenshots, files, repositories) is `null` or an
 * evidence slot with `src: null` until real material is added.
 *
 * To add a personal project later, append an object with a new slug —
 * the card, the detail page and the static route are generated from it.
 */
export const projects: Project[] = [
  {
    slug: "linear-regression",
    index: "01",
    title: "Linear Regression",
    shortTitle: "Regression",
    category: "Machine Learning",
    module: "SUPERVISED LEARNING",
    period: null,
    status: "complete",

    cover: "/projects/linear-regression.webp",

    summary:
      "A supervised Machine Learning project that analyzes the relationship between study hours and academic scores using linear regression and predictive modeling.",

    problem:
      "How can study hours be used to estimate academic scores through a supervised learning model?",

    objective:
      "Develop a linear regression model capable of estimating academic scores, validating user input and visualizing predictions.",

    technologies: [
      "Python",
      "Pandas",
      "scikit-learn",
      "Matplotlib",
      "Google Colab",
    ],

    // Funcionamiento
    methodology: [
      "Prepare a dataset containing 30 paired observations.",
      "Define study hours as the independent variable and scores as the dependent variable.",
      "Train a Linear Regression model using scikit-learn.",
      "Evaluate model fit using R² and Mean Squared Error.",
      "Validate user input and generate predictions within the dataset range.",
      "Visualize the observed data and fitted regression line.",
    ],

    // Implementación
    implementation: [
      "Organize the dataset using a Pandas DataFrame.",
      "Calculate the regression coefficients using scikit-learn.",
      "Validate numerical input between 0.5 and 15 study hours.",
      "Generate regression graphs using Matplotlib.",
    ],

    // Fragmento de código
    code: {
      language: "python",
      snippet:
        "from sklearn.linear_model import LinearRegression\n\nmodelo = LinearRegression()\nmodelo.fit(X, y)\ny_pred = modelo.predict(X)",
    },

    // Métricas calculadas
    metrics: [
      {
        label: "R²",
        value: "0.999",
        caption: "Model fit",
        icon: "chart",
      },
      {
        label: "MSE",
        value: "0.634",
        caption: "Training error",
        icon: "layers",
      },
      {
        label: "Model",
        value: "y = m · x + b",
        caption: "Linear equation",
        icon: "function",
      },
    ],

    // Resultados
    results: [
      "The model achieved an R² of 0.99896 on the training dataset.",
      "The mean squared error was approximately 0.634.",
      "An input of 8 study hours produces a predicted score of 55.62.",
      "Input validation prevents predictions outside the supported range.",
      "The dataset is illustrative and the predictions are intended for educational purposes.",
    ],

    // Ejemplo de predicción
    prediction: {
      inputLabel: "Input (hours)",
      input: "8",
      outputLabel: "Predicted score",
      output: "55.62",
    },

    // Dataset
    dataset: {
      records: "30",
      variables: "Study hours and academic score",
    },

    // Captura original
    evidence: [
      {
        caption: "Study hours vs. score with the fitted regression line",
        src: "/projects/linear-regression/regression.webp",
        alt: "Scatter plot of study hours, academic scores and the fitted regression line",
      },
    ],

    // Archivos y código fuente
    files: [
      {
        label: "main.py",
        href: "https://github.com/waltdev16/Linear_Regression/blob/main/main.py",
      },
      {
        label: "Regression visualization",
        href: "https://github.com/waltdev16/Linear_Regression/blob/main/regression.png",
      },
      {
        label: "requirements.txt",
        href: "https://github.com/waltdev16/Linear_Regression/blob/main/requirements.txt",
      },
      {
        label: "README.md",
        href: "https://github.com/waltdev16/Linear_Regression/blob/main/README.md",
      },
    ],

    repository:
      "https://github.com/waltdev16/Linear_Regression",

    demo: null,

    // Aprendizajes
    learnings: [
      "Understand the fundamentals of supervised learning.",
      "Implement Linear Regression using scikit-learn.",
      "Identify independent and dependent variables.",
      "Interpret regression coefficients, R² and MSE.",
      "Validate user input and avoid unsupported extrapolation.",
      "Visualize numerical relationships using Matplotlib.",
      "Recognize the limitations of illustrative training data.",
    ],
  },
  {
    slug: "maze-decision-trees",
    index: "02",
    title: "Race Maze",
    shortTitle: "Race Maze",
    category: "Algorithms · Game Development",
    module: "GRAPH ALGORITHMS",
    period: null,
    status: "complete",

    // Portada principal
    cover: "/projects/race-maze.webp",

    summary:
      "An interactive pixel-art racing game that combines procedural maze generation, graph traversal algorithms, vehicle customization and progressive difficulty.",

    problem:
      "How can graph algorithms be applied to generate randomized circuits and calculate efficient routes in an interactive game?",

    objective:
      "Develop a browser-based racing game using DFS for procedural maze generation and BFS for shortest-path calculations.",

    technologies: [
      "HTML5",
      "CSS3",
      "JavaScript",
      "Canvas 2D API",
      "DFS",
      "BFS",
    ],

    // Funcionamiento del proyecto
    methodology: [
      "Generate randomized maze layouts using Depth-First Search (DFS).",
      "Calculate shortest paths between accessible cells using Breadth-First Search (BFS).",
      "Navigate the circuit, collect coins and unlock the finish line.",
      "Progress through increasingly challenging levels.",
    ],

    // Proceso de desarrollo
    implementation: [
      "Build the game interface, garage and menus using HTML and CSS.",
      "Implement procedural maze generation and collision detection with JavaScript.",
      "Render pixel-art vehicles and circuits using the Canvas 2D API.",
      "Implement keyboard controls, touchscreen support and optional route assistance.",
    ],

    // Características verificables
    metrics: [
      {
        label: "Vehicles",
        value: "04",
        caption: "Selectable car models",
        icon: "layers",
      },
      {
        label: "Teams",
        value: "12",
        caption: "Racing color palettes",
        icon: "layers",
      },
      {
        label: "Algorithms",
        value: "02",
        caption: "DFS and BFS",
        icon: "function",
      },
    ],

    results: [
      "Developed a playable racing game with procedurally generated circuits.",
      "Implemented optional shortest-path assistance using BFS.",
      "Integrated vehicle customization, coin collection, a timer and level progression.",
      "Created a responsive experience without external frameworks or game engines.",
    ],

    dataset: {
      records: "Dynamically generated",
      variables: "Grid cells, walls, coins and positions",
    },

    // Videos e imágenes del proyecto
    evidence: [
      {
        caption: "Gameplay demonstration",
        src: "/projects/race-maze/videos/Maze_Demo.mp4",
        alt: "Race Maze gameplay demonstration",
      },
      {
        caption: "Car and Circuit Design during the game",
        src: "/projects/race-maze/Maze_Demo1.png",
        alt: "Car and Circuit Design",
      },
      {
        caption: "Garage and vehicle customization",
        src: "/projects/race-maze/Maze_Demo2.webp",
        alt: "Vehicle and racing team selection",
      },
    ],

    // Archivos del repositorio
    files: [
      {
        label: "index.html",
        href: "https://github.com/waltdev16/Race_Maze/blob/main/index.html",
      },
      {
        label: "README.md",
        href: "https://github.com/waltdev16/Race_Maze/blob/main/README.md",
      },
    ],

    repository: "https://github.com/waltdev16/Race_Maze",
    demo: "https://waltdev16.github.io/Race_Maze/",

    // Aprendizajes adquiridos
    learnings: [
      "Understand graph traversal algorithms.",
      "Apply DFS to procedural generation.",
      "Use BFS for shortest-path calculations.",
      "Manage game states and event-driven interactions.",
      "Render interactive graphics using the Canvas 2D API.",
      "Implement responsive keyboard and touchscreen controls.",
    ],
  },
  {
    slug: "ai-challenge-kmeans-knn",
    index: "03",
    title: "Academic Habits",
    shortTitle: "Academic Habits",
    category: "Machine Learning",
    module: "CLUSTERING / CLASSIFICATION",
    period: null,
    status: "complete",
    cover: "/projects/ai-challenge-kmeans-knn.webp",

    summary:
      "An academic Machine Learning project exploring student study habits, behavioral clustering and academic outcome classification using synthetic data.",

    problem:
      "How can Machine Learning identify study habit patterns and classify academic outcomes?",

    objective:
      "Analyze synthetic student records using K-Means clustering and KNN classification.",

    technologies: [
      "Python",
      "NumPy",
      "Pandas",
      "scikit-learn",
      "Matplotlib",
      "Jupyter Notebook",
    ],

    // Funcionamiento
    methodology: [
      "Generate 500 synthetic student records using a fixed random seed.",
      "Explore the relationship between study habits and academic performance.",
      "Standardize the features and compare K-Means with three and four clusters.",
      "Train a KNN classifier using a stratified 75/25 train-test split.",
      "Evaluate model performance and compare different neighbor counts.",
    ],

    // Implementación
    implementation: [
      "Generate and prepare synthetic data using NumPy and Pandas.",
      "Implement K-Means clustering and PCA visualizations.",
      "Build a KNN classification pipeline with feature scaling.",
      "Evaluate accuracy, silhouette scores and confusion matrices.",
      "Compare seven values of k with and without feature scaling.",
    ],

    // Métricas
    metrics: [
      {
        label: "Dataset",
        value: "500",
        caption: "Synthetic student records",
        icon: "layers",
      },
      {
        label: "Accuracy",
        value: "81.6%",
        caption: "Scaled KNN · k = 5",
        icon: "chart",
      },
      {
        label: "Silhouette",
        value: "0.379",
        caption: "K-Means · k = 3",
        icon: "function",
      },
    ],

    // Resultados
    results: [
      "Three clusters achieved a higher silhouette score than four clusters.",
      "KNN achieved 81.6% accuracy with scaled features and 77.6% without scaling.",
      "Feature scaling improved baseline classification accuracy by 4 percentage points.",
      "The results are specific to synthetic data and should not be used to assess real students.",
    ],

    // Información del dataset
    dataset: {
      records: "500",
      variables:
        "Study hours, attendance, assignments, grade and result",
    },

    // Visualizaciones
    evidence: [
      {
        caption: "K-Means: three vs four clusters",
        src: "/projects/academic-habits/02-kmeans-clusters.webp",
        alt: "Comparison of K-Means clustering solutions",
      },
      {
        caption: "KNN confusion matrix",
        src: "/projects/academic-habits/03-knn-confusion-matrix.webp",
        alt: "KNN classification confusion matrix",
      },
      {
        caption: "KNN accuracy and feature scaling",
        src: "/projects/academic-habits/04-knn-comparison.webp",
        alt: "Comparison of KNN accuracy across neighbor counts",
      },
      {
        caption: "Exploratory data analysis",
        src: "/projects/academic-habits/01-exploratory-analysis.webp",
        alt: "Study habits and academic grades",
      },
    ],

    // Archivos y código fuente
    files: [
      {
        label: "Jupyter Notebook",
        href: "https://github.com/waltdev16/Academic_Habits/blob/main/academic_habits_kmeans_knn.ipynb",
      },
      {
        label: "Dataset (.csv)",
        href: "https://github.com/waltdev16/Academic_Habits/blob/main/estudiantes_500.csv",
      },
      {
        label: "requirements.txt",
        href: "https://github.com/waltdev16/Academic_Habits/blob/main/requirements.txt",
      },
      {
        label: "README.md",
        href: "https://github.com/waltdev16/Academic_Habits/blob/main/README.md",
      },
    ],

    repository: "https://github.com/waltdev16/Academic_Habits",
    demo: null,

    // Aprendizajes
    learnings: [
      "Generate and analyze reproducible synthetic datasets.",
      "Understand supervised and unsupervised learning.",
      "Evaluate clustering quality using silhouette scores.",
      "Apply PCA for two-dimensional visualizations.",
      "Understand the importance of feature scaling in KNN.",
      "Evaluate classification models using accuracy and confusion matrices.",
      "Recognize the limitations of synthetic data and model evaluation.",
    ],
  },
  {
    slug: "commercial-hotspots",
    index: "04",
    title: "Commercial Hotspots",
    shortTitle: "Hotspots",
    category: "Geospatial Analysis · Machine Learning",
    module: "GEOSPATIAL ANALYSIS",
    period: "November 2026",
    status: "complete",

    cover: "/projects/commercial-hotspots.webp",

    summary:
      "A geospatial analysis project that combines Machine Learning, demographic data and road network analysis to evaluate potential automotive dealership locations in San Salvador, El Salvador.",

    problem:
      "How can geographic data and Machine Learning support the evaluation of potential commercial locations?",

    objective:
      "Identify geographic clusters of automotive dealerships and compare three proposed business locations using spatial, demographic and accessibility indicators.",

    technologies: [
      "Python",
      "Pandas",
      "GeoPandas",
      "scikit-learn",
      "OpenStreetMap",
      "Overpass Turbo",
      "OSMnx",
      "Folium",
      "Jupyter Notebook",
      "React",
      "TypeScript",
      "Leaflet",
      "Recharts",
      "Tailwind CSS",
      "Vite",
    ],

    // Funcionamiento del proyecto
    methodology: [
      "Collect automotive dealership locations from OpenStreetMap using Overpass Turbo.",
      "Clean and audit geographic records before training the models.",
      "Apply K-Means to identify geographic concentrations of dealerships.",
      "Classify three proposed locations using K-Nearest Neighbors.",
      "Integrate population data, district boundaries and road accessibility.",
      "Compare commercial locations through an interactive dashboard.",
    ],

    // Implementación
    implementation: [
      "Build a Python pipeline for geographic data preparation and analysis.",
      "Evaluate K-Means clustering using silhouette scores and minimum cluster sizes.",
      "Implement KNN classification with leave-one-out evaluation.",
      "Analyze road network distances using OSMnx.",
      "Integrate demographic and geographic information using GeoPandas.",
      "Develop an interactive frontend using React, TypeScript and Leaflet.",
    ],

    // Indicadores principales
    metrics: [
      {
        label: "Training records",
        value: "21",
        caption: "From 30 original OSM records",
        icon: "layers",
      },
      {
        label: "Silhouette",
        value: "0.594",
        caption: "K-Means · k = 2",
        icon: "function",
      },
      {
        label: "LOO agreement",
        value: "95.2%",
        caption: "KNN · k = 3",
        icon: "chart",
      },
    ],

    // Resultados
    results: [
      "Identified two geographic clusters containing 9 and 12 dealerships.",
      "Classified locations A and C into Zone 1 and location B into Zone 2.",
      "Achieved 95.2% leave-one-out agreement with K-Means labels.",
      "Location C was selected as the preliminary preferred alternative.",
      "The analysis supports exploratory decision-making but does not predict commercial profitability.",
    ],

    // Dataset
    dataset: {
      records: "30 original / 21 training",
      variables: "Name, category, latitude and longitude",
    },

    // Capturas y visualizaciones
    evidence: [
      {
        caption: "Interactive geospatial dashboard",
        src: "/projects/hotspots/dashboard.webp",
        alt: "Commercial Hotspots interactive dashboard",
      },
      {
        caption: "K-Means geographic clustering",
        src: "/projects/hotspots/kmeans.webp",
        alt: "Geographic clusters of automotive dealerships",
      },
      {
        caption: "KNN location classification",
        src: "/projects/hotspots/knn.webp",
        alt: "Classification of proposed commercial locations",
      },
      {
        caption: "Commercial location comparison",
        src: "/projects/hotspots/comparison.webp",
        alt: "Comparison of locations A, B and C",
      },
      {
        caption: "Dashboard demonstration",
        src: "/projects/hotspots/demo.mp4",
        alt: "Interactive dashboard demonstration",
      },
    ],

    // Archivos y código fuente
    files: [
      {
        label: "Python backend",
        href: "https://github.com/waltdev16/Hotspots_Comerciales/tree/main/backend",
      },
      {
        label: "React frontend",
        href: "https://github.com/waltdev16/Hotspots_Comerciales/tree/main/frontend",
      },
      {
        label: "Jupyter Notebook",
        href: "https://github.com/waltdev16/Hotspots_Comerciales/blob/main/notebook/hotspots.ipynb",
      },
      {
        label: "Model results",
        href: "https://github.com/waltdev16/Hotspots_Comerciales/tree/main/backend/resultados",
      },
      {
        label: "OpenStreetMap dataset",
        href: "https://github.com/waltdev16/Hotspots_Comerciales/blob/main/backend/datos/concesionarios.geojson",
      },
      {
        label: "README.md",
        href: "https://github.com/waltdev16/Hotspots_Comerciales/blob/main/README.md",
      },
    ],

    repository:
      "https://github.com/waltdev16/Hotspots_Comerciales",

    demo:
      "https://waltdev16.github.io/Hotspots_Comerciales/",

    // Aprendizajes
    learnings: [
      "Collect and validate open geographic data.",
      "Apply Machine Learning to spatial analysis.",
      "Evaluate clustering quality and model consistency.",
      "Distinguish straight-line distances from road network distances.",
      "Integrate demographic and geographic datasets.",
      "Connect Python analysis with an interactive React frontend.",
      "Recognize the limitations of exploratory commercial analysis.",
    ],
  },
  {
    slug: "web-app-backend",
    index: "05",
    title: "Personal Portfolio",
    shortTitle: "Portfolio",
    category: "Full-Stack Web Development",
    module: "FULL STACK",
    period: null,
    status: "deployed",

    cover: "/projects/portfolio/home.webp",

    summary:
      "A full-stack personal portfolio combining a professional showcase, an interactive creative environment, immersive animations, bilingual content and a server-side contact API.",

    problem:
      "How can a personal website communicate technical skills, professional experience and creative identity through a unified digital experience?",

    objective:
      "Develop a responsive, bilingual and maintainable portfolio that integrates frontend development, server-side functionality and interactive visual experiences.",

    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Three.js",
      "Motion",
      "GSAP",
      "OGL",
      "Zod",
      "Resend",
      "Vite",
    ],

    // Funcionamiento
    methodology: [
      "Design a consistent visual identity for the professional and creative experiences.",
      "Organize routes, layouts and reusable components using the Next.js App Router.",
      "Centralize editable content in TypeScript data files.",
      "Integrate three-dimensional animations and interactive elements.",
      "Implement a shared English and Spanish language system.",
      "Process contact requests through a server-side API.",
    ],

    // Implementación
    implementation: [
      "Build the professional portfolio using Next.js, React and TypeScript.",
      "Create a cinematic introduction using Three.js and Motion.",
      "Develop Walter's World as an independent React and Vite application.",
      "Integrate interactive music, writing and creative experiences.",
      "Implement POST /api/contact with shared Zod validation.",
      "Add basic spam protection, rate limiting and email delivery integration.",
      "Document the project structure and content maintenance process.",
    ],

    // Indicadores
    metrics: [
      {
        label: "Experiences",
        value: "02",
        caption: "Professional and creative",
        icon: "layers",
      },
      {
        label: "Languages",
        value: "02",
        caption: "English and Spanish",
        icon: "layers",
      },
      {
        label: "API endpoint",
        value: "01",
        caption: "Server-side contact API",
        icon: "function",
      },
    ],

    // Resultados
    results: [
      "Developed a responsive professional portfolio with reusable components.",
      "Integrated Walter's World as an independent interactive experience.",
      "Implemented bilingual navigation and content across both applications.",
      "Created a cinematic introduction and interactive visual effects.",
      "Implemented a contact API with server-side validation and basic spam protection.",
      "Established a maintainable architecture for adding future projects and content.",
    ],

    // Estructura de datos
    dataset: {
      records: "TypeScript content files",
      variables: "Projects, profile, skills, certificates and albums",
    },

    // Capturas y demostraciones
    evidence: [
      {
        "caption": "Professional portfolio",
        "src": "/projects/portfolio/home.webp",
        "alt": "Professional portfolio homepage"
      },
      {
        "caption": "Interactive project viewer",
        "src": "/projects/portfolio/hydra.webp",
        "alt": "HYDRA interactive digital twin"
      },
      {
        "caption": "About and identity",
        "src": "/projects/portfolio/about.webp",
        "alt": "About section"
      },
      {
        "caption": "Walter's World",
        "src": "/projects/portfolio/world.webp",
        "alt": "Interactive creative environment"
      },
      {
        "caption": "Captured moments",
        "src": "/projects/portfolio/moments.webp",
        "alt": "Photo gallery in My World"
      },
      {
        "caption": "Music collection",
        "src": "/projects/portfolio/music.webp",
        "alt": "Interactive album carousel"
      }
    ],

    files: [],

    repository: null,
    demo: null,

    // Aprendizajes
    learnings: [
      "Develop full-stack applications using Next.js.",
      "Organize reusable and maintainable React components.",
      "Implement server-side validation and API responses.",
      "Create immersive interfaces using three-dimensional graphics.",
      "Manage multilingual content across independent applications.",
      "Optimize responsive interfaces and visual assets.",
      "Separate application logic from editable content.",
    ],
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug) ?? null;
}
