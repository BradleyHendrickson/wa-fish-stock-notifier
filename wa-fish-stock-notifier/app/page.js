"use client"
import React, { useEffect, useState } from "react";
import moment from "moment";
import SubscriptionForm from "@/components/SubscriptionForm";

function tryEmail() {
  fetch("/api/send", {
    method: "POST", // Change to POST request
    headers: {
      "Content-Type": "application/json", // Set appropriate headers
    },
    body: JSON.stringify({
      // Include the data you want to send in the body
      subject: "Test Email",
      message: "This is a test email being sent via POST request."
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json(); // Parse JSON from the response
    })
    .then((data) => console.log(data)) // Log the response data
    .catch((error) => console.error("Error:", error));
}


const WaFishStockNotifier = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getUniqueReleaseLocations = (data) => {
    const locations = data.map(item => item.release_location);
    console.log(locations);
    // Use a Set to remove duplicates and convert it back to an array
    return [...new Set(locations)];
  };

  useEffect(() => {
    // Fetch data from the API
    fetch(
      "https://data.wa.gov/resource/6fex-3r7d.json?release_location=BATTLE GROUND LK (CLAR)"
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {

        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setUniqueLocations([]);
        setLoading(false);
      });
  }, []);

  const filteredData = data.filter((item) => {
    const releaseYear = new Date(item.release_start_date).getFullYear();
    return releaseYear === new Date().getFullYear();
  }).sort((b, a) => {
    return new Date(a.release_start_date) - new Date(b.release_start_date);
  } );
  

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <div className="bg-green-800 text-white py-4">
        <h1 className="ml-5 text-2xl font-bold">wa-fish-stock-notifier</h1>
      </div>

      <SubscriptionForm />

        <div className="w-full max-w-screen-lg px-4 bg-brown-100 py-6 flex flex-col items-center justify-center">
        <h1 className="text-green-900 text-3xl font-bold mb-6 text-center bg-green-100 p-4 rounded-lg shadow-md">
          Fish Stock Data: Battle Ground Lake
        </h1>


        <button onClick = {tryEmail} className="bg-green-800 text-white px-4 py-2 rounded-lg shadow-md mb-4">
          Send Email
        </button>
 
          {/*<pre>{JSON.stringify(filteredData, null, 2)}</pre>*/}

          <div className="overflow-x-auto">
            <table className="min-w-full bg-brown-100 border border-green-800">
              <thead>
                <tr className="bg-green-800 text-white">
                  <th className="py-2 px-4 border border-green-800">Number Released</th>
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

        </div>
      </div>
  );
};

export default WaFishStockNotifier;
