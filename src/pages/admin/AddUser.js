import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { FaRegFilePdf } from "react-icons/fa";
import { BiSearch } from 'react-icons/bi';
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { IoEyeOutline } from "react-icons/io5";

const UserListAdmin = () => {
  const [showModal, setShowModal] = useState(false);
  const [visible, setVisible] = useState(false);
  const handleOpenModal = () => {
    setShowModal(true);
  };

  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    const { data } = await supabase.from('users').select('*');
    setUsers(data);
  }

  function handleChange(event) {
    setUser((prevFormData) => ({
      ...prevFormData,
      [event.target.name]: event.target.value,
    }));
  }

  async function addUser() {
    try {
      console.log("Adding user...");
      await supabase
        .from('users')
        .insert([
          {
            student_number: user.studentNumber,
            password: user.password,
            last_name: user.lastName,
            first_name: user.firstName,
            middle_name: user.middleName,
            email: user.email,
            course: user.course,
          },
        ]);

      setShowModal(false);
      console.log("User added successfully.");
      fetchUsers();

      setUser({
        studentNumber: '',
        lastName: '',
        firstName: '',
        middleName: '',
        password: '',
        email: '',
        course: ''
      });

    } catch (error) {
      console.error("Error adding user:", error);
    }
  }
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const categories = ["All", "BSCS", "BSTM", "BSHM", "POLSCI", "BEED", "BSBA"];

  const filteredData = users.filter((user) =>
    selectedCategory === 'All' || user.course === selectedCategory
      ? String(user.student_number).includes(searchQuery) ||
      user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.middle_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
      : false
  );
  

  const handleExport = () => {
    alert('Succesfully exported as PDF...');
  };

  return (
    <div className='px-3 flex-1'>
      <div className='bg-white my-3 px-2 py-2 rounded-xl shadow-lg flex justify-between'>
        <div className='flex items-center w-full'>
          <BiSearch className='text-3xl mx-2 my-2 sm:text-4xl' />

          <input
            type='text'
            placeholder='Search'
            className='w-full px-4 py-3 border border-opacity-25 rounded-3xl focus:outline-none focus:ring-1'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select
          id='category'
          name='category'
          className='w-fit py-3 px-4 xl:ml-60 md:ml-32 bg-gray rounded-xl shadow-sm focus:outline-none focus:ring-maroon focus:border-maroon sm:text-sm'
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
            
     
      <div className="admin-table overflow-y-auto rounded-xl custom-scrollbar">
        <table className='bg-white w-full rounded-2xl px-2 py-2 shadow-xl'>
          <thead className='sticky top-0 bg-white'>
            <tr className='pb-2'>
              <th colSpan='6'>
                <div className='flex justify-between items-center px-5 py-4'>
                  <h2 className='text-xl text-black'>Users list</h2>
                  <div className="flex items-center gap-5">
                    <button
                      onClick={handleExport}
                      className='bg-maroon text-white text-sm py-3 px-3 flex items-center rounded-full cursor-pointer'>
                      <FaRegFilePdf className="mr-1" />Export as PDF
                    </button>
                    <button
                      className='bg-white text-black border rounded-xl p-3 hover:bg-maroon hover:text-white'
                      onClick={handleOpenModal}
                    >
                      Add User
                    </button>
                  </div>
                </div>
              </th>
            </tr>

            <tr className='text-left text-black text-lg border-b border-gray'>
              <th className='px-5 py-4 w-1/6'>Student No.</th>
              <th className='px-5 py-4 w-1/6'>Lastname</th>
              <th className='px-5 py-4 w-1/6'>Firstname</th>
              <th className='px-5 py-4 w-1/6'>Middlename</th>
              <th className='px-5 py-4 w-1/6'>Course</th>
              <th className='px-5 py-4 w-1/6'>Email</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((user) => (
              <tr key={user.id} className="border-b border-gray text-sm">
                <td className="px-5 py-2">{user.student_number}</td>
                <td className="px-5 py-2">{user.last_name}</td>
                <td className="px-5 py-2">{user.first_name}</td>
                <td className="px-5 py-2">{user.middle_name}</td>
                <td className="px-5 py-2">{user.course}</td>
                <td className="px-5 py-2">{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-10 flex justify-center items-center shadow-2xl" onClick={() => setShowModal(false)}>
          <div className="bg-peach p-4 rounded-lg shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4 text-center">
              Student Information
            </h2>

            <form onSubmit={(e) => { e.preventDefault(); addUser(user); }}>
              <div className="grid grid-cols-2 gap-10">
                <div className="flex flex-col w-72">
                  <label className="text-sm ml-1">Student number:</label>

                  <input
                    type="number"
                    placeholder="Student Number"
                    className="shadow-lg rounded-xl text-sm px-5 py-4 mb-4 w-full"
                    name="studentNumber"
                    value={user.studentNumber}
                    onChange={handleChange}
                    required
                  />

                  <label className="text-sm ml-1">Lastname:</label>
                  <input
                    type="text"
                    placeholder="Lastname"
                    className="shadow-lg rounded-xl text-sm px-5 py-4 mb-4 w-full"
                    name="lastName"
                    value={user.lastName}
                    onChange={handleChange}
                    required
                  />

                  <label className="text-sm ml-1">Firstname:</label>
                  <input
                    type="text"
                    placeholder="Firstname"
                    className="shadow-lg rounded-xl text-sm px-5 py-4 mb-4 w-full"
                    name="firstName"
                    value={user.firstName}
                    onChange={handleChange}
                    required
                  />

                  <label className="text-sm ml-1">Middlename:</label>
                  <input
                    type="text"
                    placeholder="Middlename"
                    className="shadow-lg rounded-xl text-sm px-5 py-4 mb-4 w-full"
                    name="middleName"
                    value={user.middleName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="flex flex-col w-72">
                  <label className="text-sm ml-1">Password:</label>
                  <div className="relative">
                    <input
                      type={visible ? "text" : "password"}
                      placeholder="Password"
                      className="shadow-lg rounded-xl text-sm px-5 py-4 mb-4 w-full"
                      name="password"
                      value={user.password}
                      onChange={handleChange}
                      required
                    />
                    <div className="absolute right-0 top-0 mt-4 mr-4 text-xl text-maroon" onClick={() => setVisible(!visible)}>
                      {
                        visible ? <IoEyeOutline /> : <AiOutlineEyeInvisible />
                      }
                    </div>
                  </div>
                  <label className="text-sm ml-1">Email:</label>
                  <input
                    type="email"
                    placeholder="example@gmail.com"
                    className="shadow-lg rounded-xl text-sm px-5 py-4 mb-4 w-full"
                    name="email"
                    value={user.email}
                    onChange={handleChange}
                    required
                  />

                  <label className="text-sm ml-1">Course:</label>
                  <input
                    type="text"
                    placeholder="Course"
                    className="shadow-lg rounded-xl text-sm px-5 py-4 mb-4 w-full"
                    name="course"
                    value={user.course}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-center pt-4">
                <button
                  type="submit"
                  className="bg-maroon text-white py-2 px-4 rounded-lg mr-2 hover:bg-blue">
                  Create account
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
      
    </div>
  );
};

export default UserListAdmin;
