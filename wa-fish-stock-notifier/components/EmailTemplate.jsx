import * as React from 'react';


export function EmailTemplate(stockinginfo) {

  const { release_start_date, species, number_released, number_of_fish_per_pound } = stockinginfo?.stockingEvent;

  const formattedDate = new Date(release_start_date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
      <div className="bg-green-100 text-black p-6 rounded-lg shadow-lg max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">Stocking Event Details</h1>
        <div className="space-y-4">
          <div>
            <span className="font-semibold">Release Date: </span>
            <span>{formattedDate}</span>
          </div>
          <div>
            <span className="font-semibold">Species: </span>
            <span>{species}</span>
          </div>
          <div>
            <span className="font-semibold">Count: </span>
            <span>{number_released.toLocaleString()}</span>
          </div>
          <div>
            <span className="font-semibold">Fish per Pound: </span>
            <span>{number_of_fish_per_pound}</span>
          </div>
        </div>
        <footer className="mt-6 text-center text-sm text-gray-600">
          Data provided by data.wa.gov
        </footer>
      </div>
    );
}