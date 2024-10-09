import { EmailTemplate } from '@/components/EmailTemplate';

export default function displayEmail() {

    const body = JSON.stringify({
        location: "KLINELINE PD (CLAR)",
        stockingEvent: {
          run: "NA",
          stock: "Goldendale",
          agency: "WDFW",
          county: "Clark       ",
          origin: "HATCHERY",
          species: "Rainbow",
          cwt_code: "",
          facility: "GOLDENDALE HATCHERY",
          geo_code: "L38502",
          lifestage: "Legals",
          mark_code: "UM",
          brood_year: "2022",
          release_year: "2024",
          species_type: "Trout/Kokanee",
          total_pounds: "1200",
          release_month: "6",
          number_released: "3000",
          release_end_date: "2024-06-03T00:00:00.000",
          release_location: "KLINELINE PD (CLAR)",
          number_marked_only: "0",
          number_tagged_only: "0",
          release_start_date: "2024-06-03T00:00:00.000",
          number_marked_and_tagged: "0",
          number_neither_marked_or: "3000",
          number_of_fish_per_pound: "2.5"
        }
      }, null, 2)

    return (
        <div>
            {EmailTemplate(body)}
        </div>
    );
}