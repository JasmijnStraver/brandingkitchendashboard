// Klanten met toegang tot het dashboard. Voeg hier een regel toe per klant.
// De toegangscode mag je zelf verzinnen en per mail/DM delen met de klant.
export const CLIENTS = [
  { name: "Demo", code: "PROEFGANG" },
];

export function findClient(name, code) {
  const normalizedName = name.trim().toLowerCase();
  const normalizedCode = code.trim().toLowerCase();
  return CLIENTS.find(
    (c) =>
      c.name.trim().toLowerCase() === normalizedName &&
      c.code.trim().toLowerCase() === normalizedCode
  );
}
