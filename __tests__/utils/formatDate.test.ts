import { formatDate } from "utils/utils";

describe("formatDate", () => {
  it("retorna data no formato brasileiro dd/mm/yyyy", () => {
    const date = new Date(2025, 9, 1); // 1º de outubro de 2025 (mês é 0-indexed)
    const result = formatDate(date);
    expect(result).toBe("01/10/2025");
  });
});