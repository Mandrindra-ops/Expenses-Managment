import { Request, Response } from "express";
import { getReceiptFile } from "../services/receipt.service";

export async function downloadReceipt(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const download = req.query.download === "true";

    const result = await getReceiptFile(id);

    // Vérifier le cache
    const ifModifiedSince = req.headers["if-modified-since"];
    if (ifModifiedSince && new Date(ifModifiedSince) >= result.lastModified) {
      return res.status(304).end();
    }

    res.setHeader("Content-Type", result.mimeType);
    res.setHeader("Content-Length", result.size);
    res.setHeader("Cache-Control", "private, max-age=3600");
    res.setHeader("Last-Modified", result.lastModified.toUTCString());
    res.setHeader("Accept-Ranges", "bytes");

    res.setHeader(
      "Content-Disposition",
      download
        ? `attachment; filename="${result.filename}"`
        : `inline; filename="${result.filename}"`
    );

    res.status(200).send(result.fileBuffer);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "NOT_FOUND") {
        return res.status(404).json({
          error: "Reçu non trouvé",
          message: "Aucun fichier correspondant à cet ID",
        });
      }
      if (error.message === "NOT_FILE") {
        return res.status(400).json({
          error: "Chemin invalide",
          message: "Le reçu trouvé n'est pas un fichier",
        });
      }
    }

    console.error("Erreur lors du téléchargement du reçu:", error);
    res.status(500).json({
      error: "Erreur interne du serveur",
      message: "Impossible de récupérer le reçu",
    });
  }
}
