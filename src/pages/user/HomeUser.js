import React, { useState, useEffect } from "react";
import Books from "./Books";

const UserDashboard = ({ userFirstName }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const intervalID = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); 
    
    return () => clearInterval(intervalID);
  }, []); 

  const hour = currentTime.getHours();
  const formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const getGreeting = () => {
    if (hour >= 5 && hour < 12) {
      return 'Good morning';
    } else if (hour >= 12 && hour < 18) {
      return 'Good afternoon';
    } else {
      return 'Good evening';
    }
  };

  return (
    <div className="h-screen flex-1">
      <div className="p-3 m-3 bg-white rounded-lg">
        <div className="flex justify-between">
          <div className="Greetings">
            <p className="text-xl font-semibold pr-4">
              {getGreeting()}, <span className="text-maroon">Welcome {userFirstName}!👋</span>
            </p>
          </div>
          <div>
            <p className="text-xl font-semibold">
              {currentTime.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} |{' '}
              {currentTime.toLocaleDateString('en-US', { weekday: 'long' })}, {formattedTime}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2">
        {/* Left side */}
        <div className="flex flex-col">
          <Books />
          <div className="flex flex-col my-3">
            <h1 className="ml-3 mt-2 text-left text-xl font-bold">
              Notifications
            </h1>
            <ul className="custom-scrollbar overflow-y-auto notification-height">
              <li className="text-base ml-3 mt-4 text-black bg-white rounded-lg px-2 py-6 shadow-xl">
                <p>This is a Notification</p>
              </li>
              <li className="text-base ml-3 mt-4 text-black bg-white rounded-lg px-2 py-6 shadow-xl">
                <p>This is a Notification</p>
              </li>
              <li className="text-base ml-3 mt-4 text-black bg-white rounded-lg px-2 py-6 shadow-xl">
                <p>This is a Notification</p>
              </li>
              <li className="text-base ml-3 mt-4 text-black bg-white rounded-lg px-2 py-6 shadow-xl">
                <p>This is a Notification</p>
              </li>
              <li className="text-base ml-3 mt-4 text-black bg-white rounded-lg px-2 py-6 shadow-xl">
                <p>This is a Notification</p>
              </li>
              <li className="text-base ml-3 mt-4 text-black bg-white rounded-lg px-2 py-6 shadow-xl">
                <p>This is a Notification</p>
              </li>
              <li className="text-base ml-3 mt-4 text-black bg-white rounded-lg px-2 py-6 shadow-xl">
                <p>This is a Notification</p>
              </li>
              <li className="text-base ml-3 mt-4 text-black bg-white rounded-lg px-2 py-6 shadow-xl">
                <p>This is a Notification</p>
              </li>
              <li className="text-base ml-3 mt-4 text-black bg-white rounded-lg px-2 py-6 shadow-xl">
                <p>This is a Notification</p>
              </li>
              <li className="text-base ml-3 mt-4 text-black bg-white rounded-lg px-2 py-6 shadow-xl">
                <p>This is a Notification</p>
              </li>
              <li className="text-base ml-3 mt-4 text-black bg-white rounded-lg px-2 py-6 shadow-xl">
                <p>This is a Notification</p>
              </li>
              <li className="text-base ml-3 mt-4 text-black bg-white rounded-lg px-2 py-6 shadow-xl">
                <p>This is a Notification</p>
              </li>
              <li className="text-base ml-3 mt-4 text-black bg-white rounded-lg px-2 py-6 shadow-xl">
                <p>This is a Notification</p>
              </li>
              <li className="text-base ml-3 mt-4 text-black bg-white rounded-lg px-2 py-6 shadow-xl">
                <p>This is a Notification</p>
              </li>
              <li className="text-base ml-3 mt-4 text-black bg-white rounded-lg px-2 py-6 shadow-xl">
                <p>This is a Notification</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Right side */}
        <div className="mr-3 ml-12 mt-3 relative bg-white rounded-lg p-4 shadow-xl">
          <div className="flex flex-col">
            <p className="text-lg">Transaction History</p>
            <div className="transaction-list">
              <p className="text-black text-center py-80">Nothing to show</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard
