import React, { useState } from 'react';
import { FaRegFilePdf } from "react-icons/fa";

const LibraryLog = () => {
  const [showModal, setShowModal] = useState(false);

  const [studentNumber, setStudentNumber] = useState('');
  const [Name, setName] = useState('');
  const [course, setCourse] = useState('');



  // Define userList here
  const userList = [
    {
      studentNumber: 20226535,
      name: 'Pacatang, John Paul B.',
      course: 'BSCS',
      date: '3/22/2024',
      timein: '01:57 PM',
      timeout: '02:57 PM',
      action: 'Signed Out',
    },
    {
      studentNumber: 20226869,
      name: 'Tresmanio, Ryan T.',
      course: 'BSCS',
      date: '3/20/2024',
      timein: '12:57 AM',
      timeout: '01:38 PM',
      action: 'Signed Out',
    },
    {
      studentNumber: 20225301,
      name: 'Clara, Prime John F.',
      course: 'BSCS',
      date: '3/22/2024',
      timein: '01:57 pm',
      timeout: '02:57 pm',
      action: 'Signed Out',
    },
    {
      studentNumber: 20227468,
      name: 'Mantes, Reynold V.',
      course: 'BSCS',
      date: '3/25/2024',
      timein: '01:25 pm',
      timeout: '04:23 pm',
      action: 'Signed Out',
    },
    {
      studentNumber: 20220000,
      name: 'Yunting, Joannes Paulus',
      course: 'BSCS',
      date: '3/22/2024',
      timein: '03:12 pm',
      timeout: '06:24 pm',
      action: 'Signed Out',
    },
  ];

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);

    setStudentNumber('');
    setName('');
    setCourse('');

  };

  const handleSignIn = () => {
    alert('Oke na...');
    handleCloseModal();
  };

  const handleExport = () => {
    alert('Succesfully exported as PDF...');
  };

  return (
    <div className='px-5 my-5 flex-1'>
      <div className="admin-table overflow-y-auto rounded-xl custom-scrollbar">
        <table className='bg-white w-full rounded-2xl px-2 py-2 shadow-xl'>
          <thead className='sticky top-0 bg-white'>
            <tr className='pb-2'>
              <th colSpan='10'>
                <div className='flex justify-between items-center px-5 py-4'>
                  <h2 className='text-xl text-black'>Library Log</h2>
                  <div className="flex items-center gap-3">
                  <button
                      onClick={handleExport}
                      className="bg-gray text-black text-sm p-3 flex items-center rounded-xl hover:bg-blue hover:text-white cursor-pointer">
                      <FaRegFilePdf className="mr-1" />
                      Export as PDF
                    </button>
                    <button
                      className="bg-gray text-black text-sm font-semibold rounded-xl p-3 hover:bg-blue hover:text-white"
                      onClick={handleOpenModal}>
                      Add User
                    </button>
                  </div>
                </div>
              </th>
            </tr>

            <tr className='text-left text-black text-lg border-b border-gray'>
              <th className='px-5 py-4 w-1/6'>Student No.</th>
              <th className='px-5 py-4 w-1/6'>Name</th>
              <th className='px-4 py-4 w-1/6'>Course</th>
              <th className='px-4 py-4 w-1/6'>Date</th>
              <th className='px-4 py-4 w-1/6'>Time In</th>
              <th className='px-4 py-4 w-1/6'>Time Out</th>
              <th className='px-4 py-4 w-1/6'>Action</th>
            </tr>
          </thead>

          <tbody>
            {userList.map((item) => (
              <tr key={item.studentNumber} className='border-b border-gray text-sm'>
                <td className='px-5 py-2 w-1/12'>{item.studentNumber}</td>
                <td className='px-5 py-2 w-1/12'>{item.name}</td>
                <td className="px-5 py-2 w-1/12">{item.course}</td>
                <td className="px-5 py-2 w-1/12">{item.date}</td>
                <td className="px-5 py-2 w-1/12">{item.timein}</td>
                <td className="px-5 py-2 w-1/12">{item.timeout}</td>
                <td className="px-5 py-2 w-1/12 text-red">{item.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 z-10 flex justify-center items-center shadow-2xl bg-black bg-opacity-50"
          onClick={() => setShowModal(false)}>
          <div
            className="bg-white p-12 rounded-lg shadow"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-8 text-center">
              Student Information
            </h2>

            <div className="flex flex-col w-80">
              <div className="flex flex-col w-90">
                <label className="text-base font-semibold m-1">Student number</label>
                <input
                  type="number"
                  placeholder="Student Number"
                  className="shadow rounded-xl text-sm px-5 py-4 mb-5 w-full"
                  value={studentNumber}
                  required
                  onChange={(e) => setStudentNumber(e.target.value)}
                />

                <label className="text-base font-semibold m-1 ">Name</label>
                <input
                  type="text"
                  placeholder="Name"
                  className="shadow rounded-xl text-sm px-5 py-4 mb-4 w-full"
                  value={Name}
                  required
                  onChange={(e) => setName(e.target.value)}

                />
                <label className="text-base font-semibold m-1">Course</label>
                <input
                  type="text"
                  placeholder="Course"
                  className="shadow rounded-xl text-sm px-5 py-4 mb-4 w-full"
                  value={course}
                  required
                  onChange={(e) => setCourse(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <button
                className="bg-blue text-white py-2 px-4 rounded-lg mr-2"
                onClick={handleSignIn}
              >
                Sign in
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default LibraryLog;