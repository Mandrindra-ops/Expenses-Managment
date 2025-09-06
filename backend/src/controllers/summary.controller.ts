import { SummaryService } from "../services/summary.service";
import { Request, Response } from "express";

export const getMonthlySummary = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("Unauthentificatied user");
    }
    const summary = await SummaryService.getMonthlySummary(user.id.toString());

    res.json(summary);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    }
  }
};

export const getBudgetAlerts = async (req: Request, res: Response) => {
  try {
    const userId = String(req.user?.id);
    if (!userId) {
      res.status(403).json({ message: "unauthenticated User" });
    }
    const alerts = await SummaryService.getAlerts(userId);
    res.json(alerts);
  } catch (error) {
    if (error instanceof Error) {
      console.trace(error.message);
      res.status(500).json({ message: error.message });
    }
  }
};
export const getCustomSummary = async (req: Request, res: Response) => {
  try {
    const { start, end } = req.query;

    if (!start || !end) {
      return res
        .status(400)
        .json({ error: "Start and end dates are required" });
    }

    const userId = req.user?.id.toString();
    const startDateParse = new Date(String(start));
    const endDateParse = new Date(String(end));

    if (!userId) {
      return res.status(403).json({ message: "UnAuthenticated User" });
    }
    const customSummary = await SummaryService.getSummary(
      userId,
      startDateParse,
      endDateParse
    );
    res.json({ customSummary });
  } catch (error) {
    if (error instanceof Error)
      res.status(500).json({ message: error.message });
  }
};
