/**
 * ENGINEERING CORNER — the blueprint, the CAD screen and the gear model.
 * The numbers describe the drawings in the room (they are design examples).
 */

export const engineering = {
  intro:
    "Engineering is where my two interests meet: the ideas that get written as code and the parts that move. A gear train and an algorithm are both systems — what matters is how the parts connect.",
  gear: {
    driver: { teeth: 24, label: "Driver gear" },
    driven: { teeth: 12, label: "Driven gear" },
    module: 3, // mm, tooth size
  },
  notes: [
    { k: "Gear ratio", v: "Driven turns ÷ driver turns = driver teeth ÷ driven teeth." },
    { k: "Module (m)", v: "Pitch diameter ÷ number of teeth. Two gears only mesh if their module matches." },
    { k: "Pitch diameter", v: "m × z. For the drawing on the wall: 3 mm × 24 = 72 mm." },
    { k: "Trade-off", v: "Speed goes up, torque goes down by the same ratio (minus friction losses)." },
  ],
  interests: [
    "Mechanical systems and how motion is transmitted",
    "Robotics: programs that have to deal with motors and sensors",
    "Systems engineering: connecting software, data and hardware",
  ],
};
