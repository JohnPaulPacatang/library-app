import React, { useState, useEffect } from "react";
import CanvasJSReact from "@canvasjs/react-charts";
import Greetings from "./Greetings";
import { supabase } from '../../utils/supabaseClient';

const SA_Dashboard = () => {
  const CanvasJSChart = CanvasJSReact.CanvasJSChart;

  const [userCountsByDay, setUserCountsByDay] = useState({});

  useEffect(() => {
    fetchUserCounts();
    const interval = setInterval(fetchUserCounts, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchUserCounts = async () => {
    try {
      const { data: users, error } = await supabase
        .from('users')
        .select('timestamp');

      if (error) {
        throw error;
      }

      const counts = {
        Sunday: 0,
        Monday: 0,
        Tuesday: 0,
        Wednesday: 0,
        Thursday: 0,
        Friday: 0,
        Saturday: 0
      };

      users.forEach(user => {
        const dayOfWeek = new Date(user.timestamp).getDay();
        switch (dayOfWeek) {
          case 0:
            counts.Sunday++;
            break;
          case 1:
            counts.Monday++;
            break;
          case 2:
            counts.Tuesday++;
            break;
          case 3:
            counts.Wednesday++;
            break;
          case 4:
            counts.Thursday++;
            break;
          case 5:
            counts.Friday++;
            break;
          case 6:
            counts.Saturday++;
            break;
          default:
            break;
        }
      });

      setUserCountsByDay(counts);
    } catch (error) {
      console.error('Error fetching user counts by day:', error.message);
    }
  };

  const options = {
    height: 400,
    axisY: {
      maximum: 16,
    },
    data: [
      {
        type: "column",
        dataPoints: [
          { label: "Sunday", y: userCountsByDay.Sunday || 0, color: "#59adff" },
          { label: "Monday", y: userCountsByDay.Monday || 0, color: "#59adff" },
          { label: "Tuesday", y: userCountsByDay.Tuesday || 0, color: "#59adff" },
          { label: "Wednesday", y: userCountsByDay.Wednesday || 0, color: "#59adff" },
          { label: "Thursday", y: userCountsByDay.Thursday || 0, color: "#59adff" },
          { label: "Friday", y: userCountsByDay.Friday || 0, color: "#59adff" },
          { label: "Saturday", y: userCountsByDay.Saturday || 0, color: "#59adff" },
        ],
      },
    ],
  };

  const [totalUsers, setTotalUsers] = useState([]);
  const [totalunavailable, setTotalUnavailble] = useState(0); // Initialize totalAvailableBooks as a number
  const [overdueBooks, setOverdueBooks] = useState(0); // Initialize overdueBooks as a number


  useEffect(() => {
    fetchTotalUsers();
    fetchTotalUnavailableBooks();
    fetchOverdueBooks();
    const interval = setInterval(() => {
      fetchTotalUsers();
      fetchTotalUnavailableBooks();
      fetchOverdueBooks();
    }, 3000);
    return () => clearInterval(interval);
  }, []);


  const fetchTotalUsers = async () => {
    try {
      const { data: total, error } = await supabase
        .from('users')
        .select('*');
      if (error) {
        throw error;
      }
      setTotalUsers(total);
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };

  const fetchTotalUnavailableBooks = async () => {
    try {
      const { data: notavailableBooks, error } = await supabase
        .from('books')
        .select('*')
        .eq('availability', 'FALSE'); // Fetch records where availability is 'TRUE'

      if (error) {
        throw error;
      }

      setTotalUnavailble(notavailableBooks.length); // Set totalAvailableBooks to the count of available books
    } catch (error) {
      console.error('Error fetching available books:', error.message);
    }
  };

  const fetchOverdueBooks = async () => {
    try {
      const { data: overdue, error } = await supabase
        .from('borrowbooks')
        .select('*')
        .eq('status', 'Overdue');
      if (error) {
        throw error;
      }
      setOverdueBooks(overdue.length); // Set overdueBooks to the count of overdue books
    } catch (error) {
      console.error('Error fetching overdue books:', error.message);
    }
  };

  const fetchInterval = 1000;

  const fetchData = async (table, columns) => {
    const { data, error } = await supabase.from(table).select(columns);
    if (error) {
      console.error(`Error fetching ${table}:`, error.message);
      return [];
    }
    return data;
  };

  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [borrowedBookss, setBorrowedBookss] = useState([]);
  const [topPickedBook, setTopPickedBook] = useState(null);
  const [topStudents, setTopStudents] = useState([]);

  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      const data = await fetchData('borrowbooks', 'book_title');
      setBorrowedBooks(data);
    };
    const interval = setInterval(fetchBorrowedBooks, fetchInterval);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const countBooks = () => {
      const bookCounts = {};
      borrowedBooks.forEach(book => {
        const { book_title } = book;
        bookCounts[book_title] = (bookCounts[book_title] || 0) + 1;
      });
      const sortedBooks = Object.entries(bookCounts).sort((a, b) => b[1] - a[1]);
      if (sortedBooks.length > 0) {
        const [topBookId] = sortedBooks[0];
        setTopPickedBook(topBookId);
      }
    };
    const interval = setInterval(countBooks, fetchInterval);
    return () => clearInterval(interval);
  }, [borrowedBooks]);

  useEffect(() => {
    const fetchBorrowedStudents = async () => {
      const data = await fetchData('borrowbooks', 'full_name');
      setBorrowedBookss(data);
    };
    const interval = setInterval(fetchBorrowedStudents, fetchInterval);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const countStudents = () => {
      const studentCounts = {};
      borrowedBookss.forEach(book => {
        const { full_name } = book;
        studentCounts[full_name] = (studentCounts[full_name] || 0) + 1;
      });
      const sortedStudents = Object.entries(studentCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
      setTopStudents(sortedStudents);
    };
    const interval = setInterval(countStudents, fetchInterval);
    return () => clearInterval(interval);
  }, [borrowedBookss]);


  return (
    <div className="statistics-section flex-1">
      <Greetings></Greetings>
      <div className="flex justify-between mt-10 mb-8 gap-5">
        <div className="p-12 h-60 w-full bg-white mx-5 rounded-xl shadow">
          <p className="text-4xl text-center mt-5 font-bold">{totalUsers.length}</p>
          <p className="center text-lg font-bold text-center my-3">Total Users</p>
        </div>

        <div className="p-12 h-60 w-full bg-white mr-5 rounded-xl shadow">
          <p className="text-xl text-blue text-center mt-5 font-bold">{topPickedBook}</p>
          <p className="center text-lg font-bold text-center my-3">
            Top Picked Book
          </p>
        </div>

        <div className="p-12 h-60 w-full bg-white mr-5 rounded-xl shadow">
          <p className="text-4xl text-center mt-5 font-bold">{totalunavailable}</p>
          <p className="center text-lg font-bold text-center my-3">
            Currently Issued Books
          </p>
        </div>

        <div className="p-12 h-60 w-full bg-white mr-5 rounded-xl shadow">
          <p className="text-4xl text-center mt-5 font-bold">{overdueBooks}</p>
          <p className="center text-lg font-bold text-center my-3">
            Overdue Books
          </p>
        </div>
      </div>

      <div className="flex">
        <div className="h-auto w-full bg-white mx-5 p-5 mt-5 rounded-xl shadow">
          <p className="center text-lg font-bold text-center my-3">
            Registered Users
          </p>
          <CanvasJSChart options={options} />
        </div>

        <div className="bg-white mx-5 w-1/2 mt-5 rounded-xl shadow flex flex-col">
          <p className="text-xl font-bold text-center mt-10">Top Borrower</p>
          <div className="p-10">
            {topStudents.map(([student, count], index) => (
              <p key={index} className="mt-5 p-3 w-full bg-gray rounded-md text-black flex justify-between">
                {`${index + 1}. ${student}`} <span>{`${count}`}</span>
              </p>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};


export default SA_Dashboard;