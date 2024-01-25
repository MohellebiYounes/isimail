import axios from 'axios';
import { React, useEffect, useState } from 'react';
import DeletEmail from '../components/DeleteEmail.jsx';
import Restore from '../components/restoreComponent.jsx';
import { FaEnvelopeOpen, FaSearch, FaTrash, FaUndo } from 'react-icons/fa';


function Trash() {
  const [data, setData] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  let [currentPage, setCurrentPage] = useState(1)

  const getTrashes = () => {
    const instance = axios.create({
      withCredentials: true
    });
    
    const params = {
      pageSize: 10,
      pageNumber: currentPage, 
      emailSender: localStorage["email"]
    };
    
    instance.get(`${process.env.REACT_APP_API_LINK}trash/trashes-page`, { params: params })
    .then(function (res) {
      setData(res.data.emails)
      setTotalPages(res.data.totalPages)
      setCurrentPage(res.data.page)
    })
    .catch(function (error) {
      console.log(error)
    });
  }

  const formatDate = (date) => {
    return date.substring(0, 10) + " " + date.substring(11, 16)
  }

  const getNext = () => {
    if (currentPage >= totalPages) return;
    currentPage = Number(currentPage) + 1
    getTrashes()
  }

  const getPrevious = () => {
    currentPage = Number(currentPage) - 1
    if (currentPage < 1) return;
    getTrashes()
  }

  useEffect(() => {
    getTrashes()
  }, []);

  return (
    <div className="rounded">
      <table cellSpacing={2} cellPadding={5} border={1} className="border-collapse table-fixed w-full text-sm bg-white text-left">
        <thead>
        <th colSpan={0} className="py-2 px-4 font-semibold text-gray-200 bg-gray-200 "><FaTrash className="text-gray-600 text-sm" /></th>
          <th colSpan={2} className="py-2 px-4 font-semibold text-gray-700 bg-gray-200">Adress</th>
          <th colSpan={5} className="py-2 px-4 font-semibold text-gray-700 bg-gray-200" >Subject</th>
          <th colSpan={5} className="py-2 px-4 font-semibold text-gray-700 bg-gray-200" >Content</th>
          <th colSpan={2} className="py-2 px-4 font-semibold text-gray-700 bg-gray-200">Date</th>
          <th colspan={1} className="py-2 px-4 font-semibold text-gray-700 bg-gray-200"></th>
        </thead>
        <tbody>
          {data?.map((i) => {
            return (
              <tr>
                <td colSpan={0} className="py-2 px-4 border-b border-gray-200"><span>{i.read === 0 ? '-' : '+'}</span></td>
                <td colSpan={2} className="py-2 px-4 border-b border-gray-200">{i.email_receiver}</td>
                <td colSpan={5} className="py-2 px-4 border-b border-gray-200">{i.subject}</td>
                <td colSpan={5} className="py-2 px-4 border-b border-gray-200">{i.content}</td>
                <td colspan={2} className="py-2 px-4 border-b border-gray-200">{formatDate(i.sending_date)}</td>
                <td colspan={1} className="py-2 px-4 border-b border-gray-200 text-right" style={{ display: 'flex', gap: '-5px' }}>
                  <DeletEmail id={i._id}  />
                  <Restore id={i._id} />
                </td>
              </tr>
            );
          })}

        </tbody>
      </table>
      <div className=" float-right mt-2">
        <div class="flex flex-col items-center">
          <div class="inline-flex mt-2 xs:mt-0">
            <button onClick={() => getPrevious()} class="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-blue-500 rounded hover:bg-gray-900">
              Prev
            </button>
            <span class="text-sm text-gray-700 mx-3 my-1">
              Page <span class="font-semibold text-gray-900">{currentPage}</span> / <span class="font-semibold text-gray-900">{totalPages}</span>
            </span>
            <button onClick={() => getNext()} class="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-blue-500 border-gray-700 rounded hover:bg-gray-900">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Trash;
