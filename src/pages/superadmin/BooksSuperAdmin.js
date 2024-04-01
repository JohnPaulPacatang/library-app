import React, { useState, useEffect } from "react";
import { supabase } from '../../utils/supabaseClient';
import { FaRegFilePdf } from "react-icons/fa";
import { BiSearch } from "react-icons/bi";
import { Menu, MenuButton, MenuList, MenuItem, IconButton } from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const BookSuperAdmin = () => {

  // Modals
  const [showModal, setShowModal] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [showModalIssue, setShowModalIssue] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleOpenModalUpdate = () => {
    setShowModalUpdate(true);
  };

  const handleOpenModalIssue = () => {
    setShowModalIssue(true);
  };


  // Dropdown category and search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");


  // Pang select table
  const [selectedTable, setSelectedTable] = useState('Books');
  const handleTableChange = (event) => {
    setSelectedTable(event.target.value);
  };


   // Category sa books
   const categories = [
    "All",
    "History and Geography",
    "Literature",
    "Psychology and Philosophy",
    "Natural Sciences",
  ];


  const [issuedBooks] = useState([
    {
      studentNumber: "123456",
      fullName: "John Paul Pacatang",
      docId: "789",
      title: "Sample Book 1",
      issueDate: "2024-03-07",
      returnDate: "2024-03-21",
      status: "Issued",
    },
    {
      studentNumber: "456789",
      fullName: "Prime John Clara",
      docId: "012",
      title: "Sample Book 2",
      issueDate: "2024-03-08",
      returnDate: "2024-03-22",
      status: "Issued",
    },
    {
      studentNumber: "110011",
      fullName: "Ryan Tresmanio",
      docId: "014",
      title: "Sample Book 3",
      issueDate: "2024-03-12",
      returnDate: "2024-03-22",
      status: "Overdue",
    },
  ]);


  // Fetch books para sa table
  const [books, setBooks] = useState([]);

  // Ginagamit sa Add saka update
  const [book, setBook] = useState([]);
  const [bookData, setBookData] = useState([]);

  // Para sa realtime fetch
  useEffect(() => {
    fetchBooks();
  }, []);

  // Fetch table
  async function fetchBooks() {
    const { data } = await supabase.from('books').select('*');
    setBooks(data);
  }


  // Pang handle sa mga modal form
  function handleChange(event) {
    setBook((prevFormData) => ({
      ...prevFormData,
      [event.target.name]: event.target.value,
    }));
  }

  function handleUpdate(event) {
    setBookData((prevFormData) => ({
      ...prevFormData,
      [event.target.name]: event.target.value,
    }));
  }


  // Add book
  async function addBook() {
    try {
      await supabase
        .from('books')
        .insert([
          {
            ddc_id: book.ddcId,
            title: book.title,
            author: book.author,
            category: book.category,
            availability: book.availability === 'true' ? true : false,
          },
        ]);

      setShowModal(false);
      fetchBooks();


      //Pang null ng form
      setBook({
        ddcId: '',
        title: '',
        author: '',
        category: '',
        availability: '',
      });

      toast.success("Book added successfully", {
        autoClose: 2000,
        hideProgressBar: true
      });

    } catch (error) {
      toast.error("Error adding book. Please try again.", {
        autoClose: 2000,
        hideProgressBar: true
      });
    }
  }


  // Pang display ng book info para sa update
  function displayBook(bookId) {
    const book = books.find((book) => book.id === bookId);
    if (book) {
      setBookData({
        id: book.id,
        ddc_id: book.ddc_id,
        title: book.title,
        author: book.author,
        category: book.category,
        availability: book.availability,
      });
    }
  }

  // Pang update ng book info
  async function updateBook(bookId) {
    try {
      await supabase
        .from('books')
        .update({
          ddc_id: bookData.ddc_id,
          title: bookData.title,
          author: bookData.author,
          category: bookData.category,
          availability: bookData.availability,
        })
        .eq('id', bookId);

      setShowModalUpdate(false);
      fetchBooks();

      toast.success("Book updated successfully", {
        autoClose: 2000,
        hideProgressBar: true
      });

    } catch (error) {
      toast.error("Error updating book. Please try again.", {
        autoClose: 2000,
        hideProgressBar: true
      });
    }
  }


  // Delete book
  async function deleteBook(bookId) {
    try {
      await supabase
        .from('books')
        .delete()
        .eq('id', bookId);

      fetchBooks();

      toast.success("Book deleted successfully", {
        autoClose: 2000,
        hideProgressBar: true
      });

    } catch (error) {
      toast.error("Error deleting book. Please try again.", {
        autoClose: 2000,
        hideProgressBar: true
      });
    }
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

  const handleExport = () => {
    alert("Succesfully exported as PDF...");
  };


  return (
    <div className="px-5 flex-1">
      <div className="bg-white my-5 px-2 py-2 rounded-xl shadow flex justify-between search-container">
        <div className="flex items-center w-full">
          <BiSearch className="text-3xl mx-2 my-2" />

          <input
            type="text"
            placeholder="Search"
            className="w-3/4 px-4 py-2 border border-opacity-25 rounded-xl focus:outline-none focus:ring-1"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          id="table"
          name="table"
          className="w-fit py-3 px-4 xl:ml-60 md:ml-32 bg-gray rounded-xl shadow sm:text-sm"
          value={selectedTable}
          onChange={handleTableChange}>
          <option value="Books">Books</option>
          <option value="Issue">Issue</option>
        </select>

      </div>
      {selectedTable === 'Books' && (
        <div className="admin-table overflow-y-auto rounded-xl custom-scrollbar">
          <table className="bg-white w-full rounded-lg px-2 py-2 shadow-xl">
            <thead>
              <tr className="pb-2">
                <th colSpan="10">
                  <div className="flex justify-between items-center px-5 py-4">
                    <h2 className="text-xl text-black">Book list</h2>
                    <div>
                      <button
                        className="bg-gray text-black text-sm font-semibold rounded-xl p-3 hover:bg-blue hover:text-white"
                        onClick={handleOpenModal}>
                        Add Book
                      </button>
                      <select
                        id="category"
                        name="category"
                        className="w-fit py-3 px-4 ml-5 bg-gray rounded-xl font-semibold shadow-sm text-sm"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}>
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </th>
              </tr>

              <tr className="text-left text-black text-lg border-b border-gray">
                <th className="px-5 py-4">DDC ID</th>
                <th className="px-5 py-4">Title of the book</th>
                <th className="px-5 py-4">Author</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredData.map((book) => (
                <tr key={book.id} className="border-b border-gray text-sm">
                  <td className="px-5 py-2">{book.ddc_id}</td>
                  <td className="px-5 py-2">{book.title}</td>
                  <td className="px-5 py-2">{book.author}</td>
                  <td className="px-5 py-2">{book.category}</td>
                  <td className={`px-1 py-2 text-center ${book.availability ? "bg-green text-black" : "bg-red text-white"
                    } m-2 inline-block rounded-xl text-sm w-3/4`}>
                    {book.availability ? "Available" : "Not Available"}
                  </td>
                  <td className="px-5">
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        aria-label='Options'
                        icon={<BsThreeDots style={{ fontSize: '2.5rem', marginLeft: '0.5rem' }} />}
                        variant='outline'
                      />
                      <MenuList className="bg-white shadow rounded-lg p-1 input-border" zIndex={10}>
                        <MenuItem>
                          <button className="text-sm text-black w-full p-2 m-2 font-semibold hover:underline"
                            onClick={() => { displayBook(book.id); handleOpenModalUpdate(); }}>Update</button>
                        </MenuItem>
                        <MenuItem>
                          <button className="text-sm text-black w-full p-2 m-2 font-semibold hover:underline"
                            onClick={() => { if (window.confirm("Are you sure you want to delete this book?")) { deleteBook(book.id); } }}>Delete
                          </button>
                        </MenuItem>
                        <MenuItem>
                          <button className="text-sm text-black w-full p-2 m-2 font-semibold hover:underline"
                            onClick={handleOpenModalIssue}>Issue</button>
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedTable === 'Issue' && (
        <div className="admin-table overflow-y-auto rounded-xl custom-scrollbar">
          <table className="bg-white w-full rounded-2xl px-2 py-2 shadow-xl">
            <thead className="sticky top-0 bg-white">
              <tr className="pb-2">
                <th colSpan="10">
                  <div className="flex justify-between items-center px-5 py-4">
                    <h2 className="text-xl text-black">Book Issued</h2>
                    <button
                      onClick={handleExport}
                      className="bg-gray text-black text-sm p-3 flex items-center rounded-xl hover:bg-blue hover:text-white cursor-pointer">
                      <FaRegFilePdf className="mr-1" />
                      Export as PDF
                    </button>
                  </div>
                </th>
              </tr>

              <tr className="text-left text-black text-lg border-b border-gray">
                <th className="px-5 py-4">Student No.</th>
                <th className="px-5 py-4">Fullname</th>
                <th className="px-5 py-4">DDC ID</th>
                <th className="px-5 py-4">Title</th>
                <th className="px-5 py-4">Issue Date</th>
                <th className="px-5 py-4">Return Date</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {issuedBooks.map((issue, index) => (
                <tr key={index} className="border-b border-gray text-sm">
                  <td className="px-5 py-2">{issue.studentNumber}</td>
                  <td className="px-5 py-2">{issue.fullName}</td>
                  <td className="px-5 py-2">{issue.docId}</td>
                  <td className="px-5 py-2">{issue.title}</td>
                  <td className="px-5 py-2">{issue.issueDate}</td>
                  <td className="px-5 py-2">{issue.returnDate}</td>
                  <td className="px-5 py-2">{issue.status}</td>
                  <td className="px-5">
                    <button className="text-sm text-blue font-normal py-2 my-2  rounded-lg hover:text-black">Mark as Returned</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-10 flex justify-center items-center shadow-2xl bg-black bg-opacity-50" onClick={() => setShowModal(false)} >
          <div className="bg-white p-8 rounded-lg shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-4 text-center">
              Book Information
            </h2>

            <form onSubmit={(e) => { e.preventDefault(); addBook(book); }}>
              <div className="grid grid-cols-2 gap-10">
                <div className="flex flex-col w-72">
                  <label className="text-sm m-1 font-semibold">DDC ID</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="DDC ID"
                    className="shadow input-border rounded-xl text-sm px-5 py-4 mb-4 w-full"
                    name="ddcId"
                    value={book.ddcId}
                    onChange={handleChange}
                    required
                  />

                  <label className="text-sm m-1 font-semibold">Title</label>
                  <input
                    type="text"
                    placeholder="Title"
                    className="shadow input-border rounded-xl text-sm px-5 py-4 mb-4 w-full"
                    name="title"
                    value={book.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="flex flex-col w-72">
                  <label className="text-sm m-1 font-semibold">Author</label>
                  <input
                    type="text"
                    placeholder="Author"
                    className="shadow input-border rounded-xl text-sm px-5 py-4 mb-4 w-full"
                    name="author"
                    value={book.author}
                    onChange={handleChange}
                    required
                  />

                  <label className="text-sm m-1 font-semibold">Category</label>
                  <input
                    type="text"
                    placeholder="Category"
                    className="shadow input-border rounded-xl text-sm px-5 py-4 mb-4 w-full"
                    name="category"
                    value={book.category}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-center">
                <div className="flex flex-col">
                  <label className="text-sm ml-1 font-semibold">Availability</label>
                  <select
                    className="shadow input-border rounded-xl text-sm px-5 py-4 mb-4 font-semibold"
                    name="availability"
                    value={book.availability}
                    onChange={handleChange}
                    required>
                    <option value="">Select Status</option>
                    <option className="text-green font-semibold" value={true}>Available</option>
                    <option className="text-red font-semibold" value={false}>Not Available</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-center pt-4">
                <button type="submit" className="bg-blue text-white py-2 px-4 rounded-lg mr-2" >
                  Add Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {showModalUpdate && (
        <div className="fixed inset-0 z-10 flex justify-center items-center shadow-2xl bg-black bg-opacity-50" onClick={() => setShowModalUpdate(false)} >
          <div className="bg-white p-8 rounded-lg shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-4 text-center">
              Book Information
            </h2>

            <form onSubmit={(e) => { e.preventDefault(); updateBook(bookData.id); }}>
              <div className="grid grid-cols-2 gap-10">
                <div className="flex flex-col w-72">
                  <label className="text-sm m-1 font-semibold">DDC ID</label>
                  <input
                    type="number"
                    step="any"
                    className="shadow input-border rounded-xl text-sm px-5 py-4 mb-4 w-full"
                    name="ddc_id"
                    defaultValue={bookData.ddc_id}
                    onChange={handleUpdate}
                  />

                  <label className="text-sm m-1 font-semibold">Title</label>
                  <input
                    type="text"
                    className="shadow input-border rounded-xl text-sm px-5 py-4 mb-4 w-full"
                    name="title"
                    defaultValue={bookData.title}
                    onChange={handleUpdate}
                  />
                </div>

                <div className="flex flex-col w-72">
                  <label className="text-sm m-1 font-semibold">Author</label>
                  <input
                    type="text"
                    className="shadow input-border rounded-xl text-sm px-5 py-4 mb-4 w-full"
                    name="author"
                    defaultValue={bookData.author}
                    onChange={handleUpdate}
                  />

                  <label className="text-sm m-1 font-semibold">Category</label>
                  <input
                    type="text"
                    className="shadow input-border rounded-xl text-sm px-5 py-4 mb-4 w-full"
                    name="category"
                    defaultValue={bookData.category}
                    onChange={handleUpdate}

                  />
                </div>
              </div>

              <div className="flex justify-center">
                <div className="flex flex-col">
                  <label className="text-sm m-1 font-semibold">Availability</label>
                  <select
                    className="shadow input-border rounded-xl text-sm px-5 py-4 mb-4 font-semibold"
                    name="availability"
                    defaultValue={bookData.availability}
                    onChange={handleUpdate}
                    required>
                    <option value="">Select Status</option>
                    <option className="text-green font-semibold" value={true}>Available</option>
                    <option className="text-red font-semibold" value={false}>Not Available</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-center pt-4">
                <button type="submit" className="bg-blue text-white py-2 px-4 rounded-lg mr-2">
                  Update
                </button>
                <button type="submit" className="bg-red text-white py-2 px-4 rounded-lg mr-2" onClick={() => setShowModalUpdate(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {showModalIssue && (
        <div className="fixed inset-0 z-10 flex justify-center items-center shadow-2xl bg-black bg-opacity-50" onClick={() => setShowModalIssue(false)} >
          <div className="bg-white p-8 rounded-lg shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-4 text-center">
              Issue Book
            </h2>

            <form>
              <div className="grid grid-cols-2 gap-4">

                <div>
                  <label className="text-sm m-1 font-semibold">
                    Student Number:
                  </label>
                  <input
                    type="text"
                    name="studentNumber"
                    id="studentNumber"
                    placeholder="12345678"
                    className="shadow input-border rounded-xl text-sm px-5 py-4 mb-4 w-full"
                  />
                </div>

                <div >
                  <label className="text-sm m-1 font-semibold">
                    DDC ID:
                  </label>
                  <input
                    type="text"
                    name="docId"
                    id="docId"
                    placeholder="1234"
                    className="shadow input-border rounded-xl text-sm px-5 py-4 mb-4 w-full"
                  />
                </div>

                <div >
                  <label className="text-sm m-1 font-semibold">
                    Book Title:
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    placeholder="Superbook"
                    className="shadow input-border rounded-xl text-sm px-5 py-4 mb-4 w-full"
                  />
                </div>

                <div>
                  <label className="text-sm m-1 font-semibold">
                    Issue Date:
                  </label>
                  <input
                    type="date"
                    name="issueDate"
                    id="issueDate"
                    className="shadow input-border rounded-xl text-sm px-5 py-4 mb-4 w-full"
                  />
                </div>

                <div>
                  <label htmlFor="returnDate" className="text-sm m-1 font-semibold">Return Date:</label>
                  <input
                    type="date"
                    name="returnDate"
                    id="returnDate"
                    className="shadow input-border rounded-xl text-sm px-5 py-4 mb-4 w-full"
                  />
                </div>
              </div>


              <div className="flex justify-center pt-4">
                <button
                  type="submit"
                  className="bg-blue text-white font-semibold py-2 px-4 rounded-md shadow-sm mt-2">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default BookSuperAdmin
