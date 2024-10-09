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

  const getUniqueReleaseLocations = (data) => {
    const locations = data.map((item) => item.release_location);
    console.log(locations);
    return [...new Set(locations)]; // Remove duplicates
  };

  useEffect(() => {
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

      <div className="w-full max-w-screen-lg px-4 bg-brown-100 py-6 flex flex-col items-center justify-center">
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
      </div>
    </div>
  );
};

export default WaFishStockNotifier;
