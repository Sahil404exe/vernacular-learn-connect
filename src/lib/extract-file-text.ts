/**
 * Reads plain text out of an uploaded .txt or .pdf file, entirely in the
 * browser. The PDF reader is loaded on demand so it never runs on the server.
 */
export async function extractFileText(file: File): Promise<string> {
  const name = file.name.toLowerCase();

  if (name.endsWith(".txt") || file.type === "text/plain") {
    return (await file.text()).trim();
  }

  if (name.endsWith(".pdf") || file.type === "application/pdf") {
    const pdfjs = await import("pdfjs-dist");
    const workerSrc = (await import("pdfjs-dist/build/pdf.worker.mjs?url"))
      .default;
    pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

    const buffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: buffer }).promise;

    const pages: string[] = [];
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();
      pages.push(
        content.items
          .map((item) => ("str" in item ? item.str : ""))
          .join(" ")
          .replace(/\s+/g, " ")
          .trim(),
      );
    }

    const text = pages.join("\n\n").trim();
    if (!text) {
      throw new Error(
        "We couldn't find any text in that PDF. It may be a scanned image.",
      );
    }
    return text;
  }

  throw new Error("Please upload a .txt or .pdf file.");
}
