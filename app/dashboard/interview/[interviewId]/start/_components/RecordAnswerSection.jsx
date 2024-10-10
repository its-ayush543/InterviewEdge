"use client";
import { Button } from "/components/ui/button";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import useSpeechToText from "react-hook-speech-to-text";
import { Mic, StopCircle } from "lucide-react";
import { chatSession } from "/utils/GeminiAIModel";
import { db } from "/utils/db";
import { UserAnswer } from "/utils/schema";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { toast } from "sonner"


function RecordAnswerSection({
  mockInterviewQuestion,
  activeQuestionIndex,
  interviewData,
}) {
  const [userAnswer, setUserAnswer] = useState("");
  const { user } = useUser();
  const [loadingState, setLoadingState] = useState(false);

  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  useEffect(() => {
    if (results.length) {
      console.log("Results:", results); // Log the results for debugging
      results.map((result) => setUserAnswer((prevAns) => prevAns + result));
    }
  }, [results]);

  useEffect(() => {
    if (!isRecording && userAnswer.length > 10) {
      UpdateUserAnswer();
    }
    // if (userAnswer?.length < 10) {
    //   setLoadingState(false);
    //   alert("Error in Recording the Answer, Please record again !!")
    //   return;
    // }
  }, [userAnswer]);

  const StartStopRecording = async () => {
    if (isRecording) {
      setLoadingState(true);
      stopSpeechToText();
    } else {
      startSpeechToText();
    }
  };

  const UpdateUserAnswer = async () => {
    setLoadingState(true);
    const feedBackPrompt =
      "Question:" +
      mockInterviewQuestion[activeQuestionIndex]?.question +
      ", User Answer:" +
      userAnswer +
      "Depending on question and user answer for given interview question , please give us rating for answer and feedback as area of improvement if any in just 3 to 5 lines in JSON format with rating field and feedback field ";

    const result = await chatSession.sendMessage(feedBackPrompt);

    const MockJSONResp = result.response
      .text()
      .replace("```json", "")
      .replace("```", "");

    console.log(MockJSONResp);
    
    const JsonFeedbackResp = JSON.parse(MockJSONResp);

    const resp = await db.insert(UserAnswer).values({
      mockIdRef: interviewData.mockId,
      question: mockInterviewQuestion[activeQuestionIndex]?.question,
      correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
      UserAns: userAnswer,
      feedback: JsonFeedbackResp?.feedback,
      rating: JsonFeedbackResp?.rating,
      userEmail: user?.primaryEmailAddress.emailAddress,
      createdAt: moment().format("DD-MM-YYYY"),
    });
    if (resp) {
      toast("User Answer Recorded Successfully");
      setResults([]);
    }
    setResults([]);
    setUserAnswer("");
    setLoadingState(false);
  };
  return (
    <div className="flex items-center justify-center flex-col">
      <div className="flex flex-col  mt-20 justify-center items-center bg-black rounded-lg p-5">
        <Image
          src={"/webcam.png"}
          width={200}
          height={200}
          className="absolute"
        />
        <Webcam
          style={{ height: 300, width: "100%", zIndex: 10 }}
          mirrored={true}
        />
      </div>
      <Button
        disabled={loadingState}
        variant="outline"
        className="my-10"
        onClick={StartStopRecording}
      >
        {isRecording ? (
          <h2 className="text-red-600 flex gap-2">
            <StopCircle /> Stop Recording
          </h2>
        ) : (
          <h2 className="flex gap-2 text-blue-700">
            <Mic/> Record Answer
          </h2>
           
        )}
      </Button>
    </div>
  );
}

export default RecordAnswerSection;
