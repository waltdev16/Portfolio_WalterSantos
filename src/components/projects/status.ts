// Etiquetas de estado de los proyectos (académicos e independientes).
// El texto se traduce con t() al mostrarse; "accent" pinta el estado en verde lima.

import type { ProjectStatus } from "@/types";

export const statusLabel: Record<ProjectStatus, string> = {
  documenting: "DOCUMENTING",
  complete: "COMPLETE",
  deployed: "DEPLOYED",
  "in-progress": "IN PROGRESS",
  prototype: "PROTOTYPE",
};

/** Estados "terminados" se muestran en verde; los demás en tono pendiente. */
export const statusTone = (status: ProjectStatus) => (status === "complete" || status === "deployed" ? "accent" : "pending");
