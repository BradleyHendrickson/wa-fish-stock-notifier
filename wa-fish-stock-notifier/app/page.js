"use client";
import React, { useEffect, useState } from "react";
import moment from "moment";
import SubscriptionForm from "@/components/SubscriptionForm";

function callServerSubscriptions() {
  fetch("/api/cron")
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error(error));
}

const WaFishStockNotifier = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [county, setCounty] = useState("");

  const getUniqueReleaseLocations = (data) => {
    const locations = data.map((item) => item.release_location);
    console.log(locations);
    return [...new Set(locations)]; // Remove duplicates
  };

  useEffect(() => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const formattedDate = oneMonthAgo.toISOString().split("T")[0];
    //trim off the time part
    const filterDate = formattedDate + "T00:00:00.000";
  

    fetch(
      `https://data.wa.gov/resource/6fex-3r7d.json?$where=release_start_date > '${filterDate}'`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        
        //get the soonest 10 records sorted by relese_end_date
        data = data.sort((b, a) => {
          return new Date(a.release_end_date) - new Date(b.release_end_date);
        }).slice(0, 10);

        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);
  


  const filteredData = data
    .filter((item) => {
      const releaseYear = new Date(item.release_start_date).getFullYear();
      return releaseYear === new Date().getFullYear();
    })
    .sort((b, a) => {
      return new Date(a.release_start_date) - new Date(b.release_start_date);
    });

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <div className="bg-green-800 text-white py-4 sticky top-0 z-50">
        <h1 className="ml-5 text-2xl font-bold">wa-fish-stock-notifier</h1>
      </div>

      {/* Background behind SubscriptionForm */}
      <div
        className="relative flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/fish.webp')",
          backgroundSize: "cover",
        }}
      >

          <SubscriptionForm />

      </div>

      <div className="w-full max-w-screen-lg px-4 bg-brown-100 py-6 mx-auto">

        <h1 className="text-green-900 text-3xl font-bold mb-6 mt-5">
          10 Most Recent Stocking Events
        </h1>

        {/* show the 10 most recent stocking events: 
          release_start_date, release_location, county, species, number_released
        */}
        <table className="min-w-full bg-brown-100 border border-green-800">
          <thead>
            <tr className="bg-green-800 text-white">
              <th className="py-2 px-4 border border-green-800">
                Release Date
              </th>
              <th className="py-2 px-4 border border-green-800">Location</th>
              <th className="py-2 px-4 border border-green-800">County</th>
              <th className="py-2 px-4 border border-green-800">Species</th>
              <th className="py-2 px-4 border border-green-800">Number Released</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (

              <tr key={index} className="hover:bg-green-200">
                <td className="py-2 px-4 border border-green-800 text-green-900">
                  {moment(item.release_start_date).format("MM/DD/YYYY")}
                </td>
                <td className="py-2 px-4 border border-green-800 text-green-900">
                  {item.release_location}
                </td>
                <td className="py-2 px-4 border border-green-800 text-green-900">
                  {item.county}
                </td>
                <td className="py-2 px-4 border border-green-800 text-green-900">
                  {item.species}
                </td>
                <td className="py-2 px-4 border border-green-800 text-green-900">
                  {item.number_released}
                </td>
              </tr>
            ))}
          </tbody>
        </table>


        {/*}
        <h1 className="text-green-900 text-3xl font-bold mb-6 text-center bg-green-100 p-4 rounded-lg shadow-md">
          Fish Stock Data: Battle Ground Lake
        </h1>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-brown-100 border border-green-800">
            <thead>
              <tr className="bg-green-800 text-white">
                <th className="py-2 px-4 border border-green-800">
                  Number Released
                </th>
                <th className="py-2 px-4 border border-green-800">Species</th>
                <th className="py-2 px-4 border border-green-800">Release Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={index} className="hover:bg-green-200">
                  <td className="py-2 px-4 border border-green-800 text-green-900">
                    <strong>{item.number_released}</strong>
                  </td>
                  <td className="py-2 px-4 border border-green-800 text-green-900">
                    {item.species}
                  </td>
                  <td className="py-2 px-4 border border-green-800 text-green-900">
                    {moment(item.release_start_date).format("MM/DD/YYYY")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        */}
      </div>
    </div>
  );
};

export default WaFishStockNotifier;
