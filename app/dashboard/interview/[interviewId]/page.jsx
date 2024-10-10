"use client";
import { Button } from "/components/ui/button";
import { db } from "/utils/db";
import { InterviewPrepp } from "/utils/schema";
import { eq } from "drizzle-orm";
import { Lightbulb, WebcamIcon } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";

function Interview({ params }) {
  const [interviewData, setInterviewData] = useState();
  const [webcamEnabled, setWebcamEnabled] = useState(false);
  useEffect(() => {
    console.log(params.interviewId);
    GetInterviewDetails();
  }, []);

  const GetInterviewDetails = async () => {
    const result = await db
      .select()
      .from(InterviewPrepp)
      .where(eq(InterviewPrepp.mockId, params.interviewId));

    console.log(result);
    setInterviewData(result[0]);
  };
  return (
    <div className="my-10">
      <h2 className="font-bold text-2xl text-primary text-center mb-10">
        Let's Get Started
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 ml-10">
        {/* Left side: Job Details */}
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-5 p-5 rounded-lg border">
            <h2 className="text-lg">
              <strong>Job Role/ Job Position: </strong>
              {interviewData?.jobPosition}
            </h2>
            <h2 className="text-lg">
              <strong>Job Description/ Tech Stack: </strong>
              {interviewData?.jobDesc}
            </h2>
            <h2 className="text-lg">
              <strong>Years of Experience: </strong>
              {interviewData?.jobExperience}
            </h2>
          </div>
          {/* Information Section */}
          <div className="p-5 border rounded-lg border-blue-800 bg-blue-100 ">
            <h2 className="flex gap-2 items-center text-blue-500">
              <Lightbulb />
              <strong>Information</strong>
            </h2>
            <h2 className="mt-3 text-blue-700">
              {process.env.NEXT_PUBLIC_INFORMATION}
            </h2>
          </div>
        </div>

        {/* Right side: Webcam Section */}
        <div className="flex flex-col items-center justify-center mr-20">
          {webcamEnabled ? (
            <Webcam
              onUserMedia={() => setWebcamEnabled(true)}
              onUserMediaError={() => setWebcamEnabled(false)}
              mirrored={true}
              className="h-85 w-full rounded-lg border"
            />
          ) : (
            <div className="flex flex-col items-center">
              <WebcamIcon className="h-72 w-72 p-20 bg-secondary rounded-lg border mb-5" />
              <Button
                onClick={() => setWebcamEnabled(true)}
                className="w-full"
                variant="ghost"
              >
                Enable Web Cam and Microphone
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Footer: Start Interview Button */}
      <div className="flex justify-end mt-10 mr-28">
        <Link href={"/dashboard/interview/" + params.interviewId + "/start"}>
          <Button>Start Interview</Button>
        </Link>
      </div>
    </div>
  );
}

export default Interview;
