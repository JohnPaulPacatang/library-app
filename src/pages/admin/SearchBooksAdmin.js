import React, { useState, useEffect } from "react";
import { supabase } from '../../utils/supabaseClient';
import { BiSearch } from "react-icons/bi";

const AdminSearchBooks = () => {
  // Dropdown category and search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Category data
  const categories = [
    "All",
    "History and Geography",
    "Literature",
    "Psychology and Philosophy",
    "Natural Sciences",
  ];

  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchBooks();
  }, []);

  async function fetchBooks() {
    const { data } = await supabase.from('books').select('*');
    setBooks(data);
  }


  // Dropdown category and search
  const filteredData = books.filter((book) =>
  (selectedCategory === "All" || book.category === selectedCategory) &&
  (
    (book.title?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (book.author?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (book.category?.toLowerCase().includes(searchQuery.toLowerCase()))
  )
);


  return (
    <div className="px-3 flex-1">
      <div className="bg-white my-3 px-2 py-2 rounded-xl shadow-lg flex justify-between search-container">
        <div className="flex items-center w-full">
          <BiSearch className="text-3xl mx-2 my-2 sm:text-4xl" />

          <input
            type="text"
            placeholder="Search"
            className="w-full px-4 py-3 border border-opacity-25 rounded-3xl focus:outline-none focus:ring-1"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select
          id="category"
          name="category"
          className="w-fit py-3 px-4 xl:ml-60 md:ml-32 bg-gray rounded-xl shadow-sm focus:outline-none focus:ring-maroon focus:border-maroon sm:text-sm category "
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
        <table className="bg-white w-full rounded-2xl px-2 py-2 shadow-xl">
          <thead>
            {/* <tr className="pb-2">
              <th colSpan="10">
                <div className="flex justify-between items-center px-5 py-4">
                  <h2 className="text-xl text-black">Book list</h2>
                </div>
              </th>
            </tr> */}

            <tr className="text-left text-black text-lg border-b border-gray">
              <th className="px-5 py-4">DDC ID</th>
              <th className="px-5 py-4">Title of the book</th>
              <th className="px-5 py-4">Author</th>
              <th className="px-5 py-4">Category</th>
              <th className="px-5 py-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((book) => (
              <tr key={book.id} className="border-b border-gray text-sm">
                <td className="px-5 py-2">{book.ddc_id}</td>
                <td className="px-5 py-2">{book.title}</td>
                <td className="px-5 py-2">{book.author}</td>
                <td className="px-5 py-2">{book.category}</td>
                <td className={`px-1 py-2 text-center ${book.availability ? "bg-green" : "bg-red"
                  } m-2 inline-block rounded-xl text-sm w-3/4`}>
                  {book.availability ? "Available" : "Not Available"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminSearchBooks;
