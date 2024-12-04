import React from "react";

const Summary = ({ eventTicketsData }) => {
  return (
    <div>
      <div className="w-[100%] mx-auto border-b-2 pb-4 border-Gray85 md:mt-0 mt-6">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-[4%]">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs w-auto text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Ticket Name
                </th>

                <th scope="col" className=" py-3 px-6 md:px-0">
                  Ticket Price
                </th>
                <th scope="col" className=" py-3 md:px-0 px-6">
                  Ticket Date
                </th>
                <th scope="col" className="py-3 px-4">
                  Quantity
                </th>
                <th scope="col" className="py-3 md:px-0 px-4">
                  Check in
                </th>
                <th scope="col" className="md:-px-3 px-6 py-3">
                  Total amount
                </th>
              </tr>
            </thead>
            <tbody>
              {eventTicketsData.map((ticketData, index) => (
                <tr
                  key={ticketData._id}
                  className={`bg-white border-b dark:bg-gray-800 dark:border-gray-700
                 }`}
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {ticketData?.TicketName}
                  </th>

                  <td className="md:pl-2 pl-6 py-4">
                    {ticketData?.TicketPrice}
                  </td>

                  <td className="w-52 py-4  md:pl-0 pl-6">
                    {ticketData?.TicketDate
                      ? new Date(ticketData.TicketDate).toLocaleDateString(
                          "en-GB",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )
                      : "N/A"}
                  </td>
                  <td className="md:pl-4 pl-8 py-4">{ticketData?.Quantity}</td>
                  <td className="md:pl-2 pl-6 py-4">{ticketData?.CheckIn}</td>
                  <td className="md:pl-4 pl-8 py-4">
                    {ticketData?.TotalAmount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Summary;
