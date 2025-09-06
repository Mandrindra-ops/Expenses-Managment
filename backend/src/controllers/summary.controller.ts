import { SummaryService } from "../services/summary.service";
import { Request, Response } from "express";

export const getMonthlySummary = async (req: Request, res: Response) => {
  try {
    const { month } = req.query;
    const userId = req.user?.id;
    if (!userId) {
      res.status(403);
      throw new Error("UnAuthoticated user");
    }
    const result = await SummaryService.getMonthlySummary(
      String(userId),
      String(month)
    );
    res.json(result);
  } catch (error) {
    if (error instanceof Error)
      res.status(500).json({ message: error.message });
  }
};
export const getBudgetAlerts = async (req: Request, res: Response) => {
  try {
    const { month } = req.query;
    const userId = req.user?.id;
    if (!userId) {
      res.status(403).json({ message: "UnAuthenticated User" });
    }
    const alerts = await SummaryService.getAlerts(
      String(userId),
      String(month)
    );
    res.json(alerts);
  } catch (error) {
    if (error instanceof Error)
      res.status(500).json({ message: error.message });
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
    const alerts = await SummaryService.getSummary(
      userId,
      startDateParse,
      endDateParse
    );
    res.json({
      periode: [startDateParse, endDateParse],
      ...alerts,
    });
  } catch (error) {
    if (error instanceof Error)
      res.status(500).json({ message: error.message });
  }
};
