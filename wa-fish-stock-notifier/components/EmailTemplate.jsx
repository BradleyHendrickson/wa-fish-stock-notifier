import * as React from 'react';

export function EmailTemplate(stockinginfoArray) {
  console.log(stockinginfoArray);

  return (
    <div style={{ backgroundColor: '#f0fdf4', color: '#000', padding: '24px', borderRadius: '8px', maxWidth: '600px', margin: '0 auto', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', textAlign: 'center' }}>
        <strong>Stocking Events Details</strong>
      </h1>
      <div>
        {stockinginfoArray.map((stockinginfo, index) => {
          const { release_start_date, species, number_released, number_of_fish_per_pound, release_location } = stockinginfo;

          const formattedDate = new Date(release_start_date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });

          return (
            <React.Fragment key={index}>
              <div style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', marginBottom: '16px' }}>
                <div>
                  {/* Location displayed in larger font */}
                  <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>
                    <strong>{release_location}</strong>
                  </div>
                  <div style={{ marginBottom: '4px' }}>
                    <span style={{ fontWeight: '600' }}>Release Date: </span>
                    <span>{formattedDate}</span>
                  </div>
                  <div style={{ marginBottom: '4px' }}>
                    <span style={{ fontWeight: '600' }}>Species: </span>
                    <span>{species}</span>
                  </div>
                  <div style={{ marginBottom: '4px' }}>
                    <span style={{ fontWeight: '600' }}>Count: </span>
                    <span>{number_released.toLocaleString()}</span>
                  </div>
                  <div>
                    <span style={{ fontWeight: '600' }}>Fish per Pound: </span>
                    <span>{number_of_fish_per_pound}</span>
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
      <footer style={{ marginTop: '24px', textAlign: 'center', fontSize: '12px', color: '#4b5563' }}>
        Data provided by data.wa.gov
      </footer>
    </div>
  );
}
