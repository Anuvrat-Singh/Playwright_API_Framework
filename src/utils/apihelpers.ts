import { match } from "assert";
import { promises } from "dns";

export async function formatAPIRequest(
  template: String,
  values: any[]
): Promise<string> {
  return template.replace(/{(\d+)}/g, (match, p1) => {
    const index = parseInt(p1, 10);
    return index < values.length ? String(values[index]) : match;
  });
}
