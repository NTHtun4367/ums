import { NonRetriableError } from "inngest";
import { inngest } from "./index";
import { Class } from "../models/class";
import { User } from "../models/user";
import { Timetable } from "../models/timetable";
import { AcademicYear } from "../models/academicYear";
import { createGroq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { Types } from "mongoose";

interface GenSettings {
  startTime: string;
  endTime: string;
  periods: number;
}

export const generateTimetableJob = inngest.createFunction(
  { id: "Generate-Timetable", triggers: [{ event: "generate/timetable" }] },
  async ({ event, step }) => {
    const { classId, academicYearId, settings } = event.data as {
      classId: string;
      academicYearId: string;
      settings: GenSettings;
    };

    // 1. Fetch System Context
    const contextData = await step.run("fetch-system-context", async () => {
      // We find the class and populate its related department/subjects if necessary
      const [classData, academicYear, allTeachers] = await Promise.all([
        Class.findById(classId),
        AcademicYear.findById(academicYearId),
        User.find({ role: "teacher", isActive: true }),
      ]);

      if (!classData) throw new NonRetriableError("Class not found!");
      if (!academicYear)
        throw new NonRetriableError("Academic Year not found!");

      // Note: Adjusting to match your User schema's 'departmentId' logic
      // Filter teachers who belong to the same department as the class
      const qualifiedTeachers = allTeachers
        .filter(
          (t) =>
            t.departmentId?.toString() === classData.departmentId.toString(),
        )
        .map((tea) => ({
          id: tea._id.toString(),
          name: tea.name,
        }));

      if (qualifiedTeachers.length === 0) {
        throw new NonRetriableError("No teachers found for this department.");
      }

      return {
        className: classData.name,
        academicYearName: academicYear.name,
        teachers: qualifiedTeachers,
      };
    });

    // 2. Generate Schedule via AI
    const aiResponse = await step.run("generate-ai-schedule", async () => {
      const apiKey = process.env.GROQ_API_KEY;
      if (!apiKey) throw new NonRetriableError("GROQ_API_KEY is missing");

      const groq = createGroq({ apiKey });

      // Check current teacher availability from other class timetables
      const otherSchedules = await Timetable.find({ academicYearId }).select(
        "schedule",
      );

      const prompt = `
        Act as a School Registrar. Generate a weekly JSON timetable for Class: ${contextData.className}.
        Academic Year: ${contextData.academicYearName}.
        Shift: ${settings.startTime} to ${settings.endTime} (${settings.periods} periods/day).

        DATA:
        - TEACHERS: ${JSON.stringify(contextData.teachers)}
        - CLASH_CONTEXT: ${JSON.stringify(otherSchedules)}

        STRICT RULES:
        1. Output ONLY a valid JSON object.
        2. Assign a "teacherId" for every period. Use exact IDs provided.
        3. No teacher can be in two places at once (Check CLASH_CONTEXT).
        4. 10m break every 2 periods. 30m lunch at 12:00 PM.

        OUTPUT JSON SCHEMA:
        {
          "schedule": [
            {
              "day": "Monday",
              "periods": [
                { "subjectId": "MOCK_SUBJECT_ID", "teacherId": "STRING_ID", "startTime": "HH:MM", "endTime": "HH:MM" }
              ]
            }
          ]
        }
      `;

      const { text } = await generateText({
        model: groq("llama-3.3-70b-versatile"),
        prompt,
        temperature: 0.1,
      });

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("AI failed to return valid JSON object");

      return JSON.parse(jsonMatch[0]);
    });

    // 3. Normalization & Save
    await step.run("save-final-timetable", async () => {
      const normalizedSchedule = aiResponse.schedule.map((day: any) => ({
        day: day.day,
        periods: day.periods.map((p: any) => ({
          // If your AI doesn't have the real subject IDs yet, it provides mock IDs
          // You should map these to real Subject Model IDs if available in contextData
          subjectId: new Types.ObjectId(p.subjectId),
          teacherId: new Types.ObjectId(p.teacherId),
          startTime: p.startTime,
          endTime: p.endTime,
          room: "Standard Room", // Default room
        })),
      }));

      await Timetable.findOneAndUpdate(
        {
          classId: new Types.ObjectId(classId),
          academicYearId: new Types.ObjectId(academicYearId),
        },
        {
          classId: new Types.ObjectId(classId),
          academicYearId: new Types.ObjectId(academicYearId),
          schedule: normalizedSchedule,
        },
        { upsert: true, new: true },
      );

      return { success: true };
    });

    return {
      message: `Timetable for ${contextData.className} generated and saved.`,
    };
  },
);
