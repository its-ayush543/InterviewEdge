
import React from 'react'
import AddNewInterview from "./_components/AddNewInterview";
import {InterviewList} from "/app/dashboard/_components/InterviewList"

function Dashboard() {
  return (
    <div>
      <h2 className="font-bold text-2xl text-blue-700 ml-20 mt-20 ">Dashboard</h2>
      <h2 className="text-black text-xl ml-20 mt-5">Create and Start Your AI Mock Interview</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 my-5">
        <AddNewInterview />
      </div>

      {/* Previous Interview List */}
      {/* {<InterviewList />} */}
    </div>
  )
}

export default Dashboard