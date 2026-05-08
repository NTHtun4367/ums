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

    // 1. Fetch DB Context
    const contextData = await step.run("fetch-system-context", async () => {
      const [classData, academicYear, allTeachers] = await Promise.all([
        Class.findById(classId).populate("subjects"),
        AcademicYear.findById(academicYearId),
        User.find({ role: "teacher", isActive: true }),
      ]);

      if (!classData) throw new NonRetriableError("Class not found!");
      if (!academicYear)
        throw new NonRetriableError("Academic Year not found!");

      const classSubjectsIds = classData.subjects.map((sub: any) =>
        sub._id.toString(),
      );

      const qualifiedTeachers = allTeachers
        .filter((teacher: any) =>
          teacher.teacherSubjects?.some((subId: any) =>
            classSubjectsIds.includes(subId.toString()),
          ),
        )
        .map((tea) => ({
          id: tea._id.toString(),
          name: tea.name,
          qualifiedSubjectIds: tea.teacherSubjects.map((id: any) =>
            id.toString(),
          ),
        }));

      if (classData.subjects.length === 0 || qualifiedTeachers.length === 0) {
        throw new NonRetriableError(
          "Missing subjects or qualified teachers for this class.",
        );
      }

      return {
        className: classData.name,
        academicYearName: academicYear.name,
        subjects: classData.subjects.map((sub: any) => ({
          id: sub._id.toString(),
          name: sub.name,
        })),
        teachers: qualifiedTeachers,
      };
    });

    // 2. Generate Schedule via AI
    const aiResponse = await step.run("generate-ai-schedule", async () => {
      const apiKey = process.env.GROQ_API_KEY;
      if (!apiKey) throw new NonRetriableError("GROQ_API_KEY is missing");

      const groq = createGroq({ apiKey });

      // Fetch only essential clash data to keep prompt size small
      const otherSchedules = await Timetable.find({ academicYearId }).select(
        "schedule",
      );

      const prompt = `
        Act as a School Registrar. Generate a weekly JSON timetable for Class: ${contextData.className}.
        Academic Year: ${contextData.academicYearName}.
        Shift: ${settings.startTime} to ${settings.endTime} (${settings.periods} periods/day).

        DATA:
        - SUBJECTS: ${JSON.stringify(contextData.subjects)}
        - TEACHERS: ${JSON.stringify(contextData.teachers)}
        - CLASH_CONTEXT: ${JSON.stringify(otherSchedules)}

        STRICT RULES:
        1. Output ONLY a valid JSON object.
        2. Assign "subjectId" and "teacherId" for every period. Use the exact IDs provided in the DATA section.
        3. A teacher must be qualified for the subjectId they are assigned.
        4. No teacher can be in two places at once (check CLASH_CONTEXT).
        5. 10m break every 2 periods. 30m lunch at 12:00 PM.

        OUTPUT JSON SCHEMA:
        {
          "schedule": [
            {
              "day": "Monday",
              "periods": [
                { "subjectId": "STRING_ID", "teacherId": "STRING_ID", "startTime": "HH:MM", "endTime": "HH:MM" }
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
      // Ensure the IDs are valid ObjectIds and keys match your schema perfectly
      const normalizedSchedule = aiResponse.schedule.map((day: any) => ({
        day: day.day,
        periods: day.periods.map((p: any) => ({
          subjectId: new Types.ObjectId(p.subjectId || p.subject), // Fallback if AI misses the 'Id' suffix
          teacherId: new Types.ObjectId(p.teacherId || p.teacher), // Fallback if AI misses the 'Id' suffix
          startTime: p.startTime,
          endTime: p.endTime,
        })),
      }));

      // Atomically replace existing timetable
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
