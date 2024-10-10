"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "/components/ui/dialog";
import { Button } from "/components/ui/button";
import { Input } from "/components/ui/input";
import { Textarea } from "/components/ui/textarea";
import { chatSession } from "/utils/GeminiAIModel";
import { LoaderCircle,  } from "lucide-react";
import { db } from "/utils/db";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { InterviewPrepp } from "/utils/schema";
import { useRouter } from "next/navigation";

function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState();
  const [jobDesc, setJobDesc] = useState();
  const [jobExperience, setJobExperience] = useState();
  const [loading, setLoading] = useState(false);
  const [jsonResponse, setJsonResponse] = useState([]);
  const router = useRouter();
  const { user } = useUser();

  const onSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    console.log(jobPosition, jobDesc, jobExperience);
    const InputPrompt =
      "Job Position: " +
      jobPosition +
      ", Job Description:" +
      jobDesc +
      " Years of Experience:" +
      jobExperience +
      ", Depending on Job position, job description and  Years of Experience give us " +
      process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT +
      " Interview Questions and Answers in JSON Format. Give us Question and Answers field in JSON";

    const result = await chatSession.sendMessage(InputPrompt);
    const MockJSONResp = result.response
      .text()
      .replace("```json", "")
      .replace("```", "");
    // console.log(JSON.parse(MockJSONResp));
    setJsonResponse(MockJSONResp);

    if (MockJSONResp) {
      const resp = await db
        .insert(InterviewPrepp)
        .values({
          mockId: uuidv4(),
          jsonMockResp: MockJSONResp,
          jobPosition: jobPosition,
          jobDesc: jobDesc,
          jobExperience: jobExperience,
          createdBy: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format("DD-MM-YYYY"),
        })
        .returning({ mockId: InterviewPrepp.mockId });

      console.log("Inserted ID: ", resp);
      if (resp) {
        setOpenDialog(false);
        router.push("/dashboard/interview/" + resp[0]?.mockId);
      }
    } else {
      console.log("Error");
    }

    setLoading(false);
  };

  return (
    <div>
      <div
        className="p-10 border rounded-r-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer ml-20"
        onClick={() => setOpenDialog(true)}
      >
        <h2 className="text-lg"> + Add New</h2>
      </div>
      <Dialog open={openDialog}>
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Tell us more about your Job Interview
            </DialogTitle>
            <DialogDescription>
              <form onSubmit={onSubmit}>
                <div>
                  <h2>
                    Add Details about your Job Position/role, Job Description
                    and Years of Experience
                  </h2>
                  <div className="mt-7 my-3">
                    <label className="font-semibold">
                      Job Roles/Job Position
                    </label>
                    <Input
                      placeholder="Ex. Full Stack Developer"
                      className="mt-2"
                      required
                      onChange={(event) => setJobPosition(event.target.value)}
                    />
                  </div>
                  <div className="my-3">
                    <label className="font-semibold">
                      Job Description/Tech Stack (In Short)
                    </label>
                    <Textarea
                      placeholder="Ex. React, Angular, NodeJs, MySQL"
                      className="mt-2"
                      required
                      onChange={(event) => setJobDesc(event.target.value)}
                    />
                  </div>
                  <div className=" my-3">
                    <label className="font-semibold">Years of Experience</label>
                    <Input
                      placeholder="5"
                      type="number"
                      max="20"
                      className="mt-2"
                      required
                      onChange={(event) => setJobExperience(event.target.value)}
                    />
                  </div>
                </div>

                <div className="flex gap-5 justify-end">
                  <Button
                    variant="ghost"
                    onClick={() => setOpenDialog(false)}
                    type="button"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <LoaderCircle className="animate-spin" />
                        'Generating From AI'{" "}
                      </>
                    ) : (
                      "Start Interview"
                    )}
                  </Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;
