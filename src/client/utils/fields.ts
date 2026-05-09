export function display(field: any): string {
  if (!field) return "";
  if (typeof field === "string") return field;
  return field.display_value || field.value || "";
}

export function value(field: any): string {
  if (!field) return "";
  if (typeof field === "string") return field;
  return field.value || "";
}
