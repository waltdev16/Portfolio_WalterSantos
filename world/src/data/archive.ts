/**
 * PERSONAL ARCHIVE — the books on the desk.
 *
 * Each volume is one story. To add a new one, copy the object below,
 * change `id`, `number` and the text. Paragraphs are plain strings.
 * Only real facts are mentioned (programs, projects and diplomas that exist);
 * everything else is reflection, written in first person.
 */

export interface Chapter {
  id: string;
  label: string; // section label (DM Mono, uppercase in the design)
  /** Short title for the index. */
  short: string;
  title: string;
  /** Line drawing beside the chapter. */
  art: "laptop" | "gear" | "board" | "chart" | "car" | "globe";
  paragraphs: string[];
}

export interface Volume {
  id: string;
  number: string; // "001"
  kicker: string;
  title: [string, string]; // second line is shown dimmed, like the prototype
  coverLine: string;
  year: string;
  lead: string;
  quote: { text: string; after: string }; // pull quote, placed after the chapter with that id
  chapters: Chapter[];
  next: { title: string; note: string };
}

export const volumes: Volume[] = [
  {
    id: "becoming-not-arriving",
    number: "001",
    kicker: "A NOTE TO MY FUTURE SELF",
    title: ["Becoming, not", "arriving."],
    coverLine: "Becoming, not arriving.",
    year: "2026",
    lead:
      "No hay un momento exacto en el que todo empieza a tener sentido. A veces simplemente comienzas a construir, a equivocarte y a descubrir qué quieres hacer con lo que aprendes.",
    quote: { text: "I don't need to have it all figured out. I just need to keep building.", after: "learning-by-making" },
    chapters: [
      {
        id: "the-beginning",
        short: "El principio",
        art: "laptop",
        label: "THE BEGINNING",
        title: "El principio de algo",
        paragraphs: [
          "Siempre me ha interesado entender cómo funcionan las cosas. No solo utilizarlas, sino descubrir qué hay detrás: las decisiones, los sistemas y las ideas que hacen que algo aparentemente imposible termine funcionando.",
          "Con el tiempo, esa curiosidad se convirtió en una dirección: aprender tecnología, explorar la ingeniería y convertir las ideas en proyectos reales. Todavía estoy construyendo ese camino, y eso es precisamente lo que quiero documentar aquí.",
        ],
      },
      {
        id: "learning-by-making",
        short: "Aprender",
        art: "gear",
        label: "LEARNING BY MAKING",
        title: "Aprender construyendo",
        paragraphs: [
          "He descubierto que una de las mejores formas de aprender es hacer. Empezar con una idea imperfecta, escribir la primera línea de código, probar algo que no funciona y volver a intentarlo.",
          "En el programa ¡Supérate! pasé diez semanas trabajando con algoritmos, inteligencia artificial, machine learning y desarrollo web. Ajusté una regresión lineal para entender la relación entre horas de estudio y calificaciones, resolví un laberinto pensándolo como un árbol de decisiones y construí una aplicación web con su propio backend.",
          "Mis proyectos han sido una forma de experimentar con programación, análisis de datos, diseño web y sistemas físicos. Cada uno me deja nuevas preguntas, herramientas y una perspectiva diferente de lo que puedo crear.",
        ],
      },
      {
        id: "beyond-the-screen",
        short: "Fuera de la pantalla",
        art: "board",
        label: "BEYOND THE SCREEN",
        title: "Fuera de la pantalla",
        paragraphs: [
          "No todo lo que he aprendido pasó frente a un editor de código. Participé en la WRO El Salvador, en la categoría RoboMission Junior, y ahí entendí que un programa también tiene que lidiar con motores, sensores y un mundo que no siempre responde como uno espera.",
          "También completé la primera edición de Empower Youth, un curso sobre liderazgo y emprendimiento, y formé parte de los clubes extracurriculares de Glasswing. Son experiencias distintas, pero todas me recordaron que construir algo casi nunca es un trabajo individual.",
          "El inglés ha sido otro proceso largo: un diploma Bronze de TOEIC en 2024 y un Silver en 2025. Y las certificaciones de Excel, Associate y Expert, me enseñaron que los datos también se ordenan, se cuestionan y se cuentan.",
        ],
      },
      {
        id: "the-process",
        short: "Lo que no se ve",
        art: "chart",
        label: "THE PROCESS",
        title: "Lo que no se ve",
        paragraphs: [
          "Detrás de cada resultado hay versiones que no salieron bien, errores difíciles de encontrar y decisiones que cambiaron a mitad de camino. Esa parte del proceso también es importante.",
          "Quiero recordar que aprender no significa saberlo todo. Significa seguir haciendo preguntas, aceptar que una idea puede mejorar y encontrar valor incluso en los intentos que no terminan como esperaba.",
        ],
      },
      {
        id: "how-things-move",
        short: "Cómo se mueven",
        art: "car",
        label: "HOW THINGS MOVE",
        title: "Cómo se mueven las cosas",
        paragraphs: [
          "Me atrae la ingeniería porque une dos mundos que me interesan: el de las ideas que se escriben y el de las piezas que se mueven. Un engranaje, un algoritmo y una base de datos tienen algo en común: todos son sistemas, y en todos importa cómo se conectan las partes.",
          "Por eso esta habitación tiene planos en la pared y engranajes sobre el escritorio. Son un recordatorio de la clase de problemas que quiero aprender a resolver: los que necesitan entender tanto el software como el mundo físico.",
        ],
      },
      {
        id: "whats-next",
        short: "Lo que viene",
        art: "globe",
        label: "WHAT'S NEXT",
        title: "Lo que viene después",
        paragraphs: [
          "Mi objetivo es seguir formándome en ingeniería y estudiar Ingeniería de Sistemas en la universidad, adquirir experiencia profesional y, eventualmente, construir algo propio. No tengo definida cada etapa, pero sí la clase de trabajo que quiero hacer: proyectos con intención, curiosidad y utilidad real.",
          "Este espacio no pretende ser una historia terminada. Es un registro de lo que voy aprendiendo, de lo que cambia y de las ideas que todavía no sé cómo resolver.",
        ],
      },
    ],
    next: { title: "002 — Still in progress.", note: "There is more to write." },
  },
];
