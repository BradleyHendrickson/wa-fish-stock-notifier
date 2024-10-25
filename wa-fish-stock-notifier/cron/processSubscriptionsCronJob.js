
import { createClient } from '@/utils/supabase/server';
import { EmailTemplate } from '@/components/EmailTemplate';
import { Resend } from 'resend';
import moment from 'moment';

const resend = new Resend(process.env.RESEND_API_KEY);
const appToken = process.env.WDFW_DATA_APP_TOKEN;

function getPSTDate(date) {
  // Convert to UTC and then adjust for PST (UTC-8)
  const utcDate = date.getTime() + (date.getTimezoneOffset() * 60000);
  const pstDate = new Date(utcDate - (8 * 60 * 60 * 1000)); // Adjust for PST
  return pstDate.toISOString().split("T")[0]; // Return the date in YYYY-MM-DD format
}

async function sendEmail(from, to, subject, stockinginfo) {

    try {
        const { data, error } = await resend.emails.send({
          from: from,
          to: to,
          subject: subject,
          react: EmailTemplate(stockinginfo),
        });
    
        if (error) {
          return Response.json({ error }, { status: 500 });
        }
    
        return Response.json(data);
      } catch (error) {
        return Response.json({ error }, { status: 500 });
      }
}

export default async function processSubscriptionsCronJob() {
    const supabase = createClient();
    console.log("Starting subscription processing");

    // Fetch all subscriptions
    const { data: subscriptions, error: supabaseError } = await supabase.from('subscription').select('*');
    if (supabaseError) {
        console.error('Error fetching subscriptions:', supabaseError);
        return;
    }

    // fetch all location last stocked info
    const { data: lastStockedConst, error: lastStockedError } = await supabase.from('last_stocked').select('*');
    if (lastStockedError) {
        console.error('Error fetching last stocked:', lastStockedError);
        return;
    }
    var lastStocked = lastStockedConst;

    // Get today's date in PST
    var todaysDate = getPSTDate(new Date(new Date().setDate(new Date().getDate())));


    // Get yesterday's date in PST
    var yesterdaysDate = getPSTDate(new Date(new Date().setDate(new Date().getDate() - 1)));

    console.log("Today's Date (PST):", todaysDate);
    console.log("Yesterday's Date (PST):", yesterdaysDate);


    const response = await fetch(`https://data.wa.gov/resource/6fex-3r7d.json?release_start_date=${todaysDate}T00:00:00.000`)

    var stockingDataToday

    if (!response.ok) {
        const stockingError = `Error: ${response.status} ${response.statusText}`;
        console.error(stockingError);
    } else {
        stockingDataToday = await response.json();
       // console.log('data for today ', stockingDataToday); // Now stockingData contains the parsed JSON response
    }    

    const response2 = await fetch(`https://data.wa.gov/resource/6fex-3r7d.json?release_start_date=${yesterdaysDate}T00:00:00.000`)
    var stockingDataYesterday
    if (!response2.ok) {
        const stockingError2 = `Error: ${response2.status} ${response2.statusText}`;
        console.error(stockingError2);
    } else {
        stockingDataYesterday = await response2.json();
        //console.log('data for yesterday ', stockingDataYesterday); // Now stockingData contains the parsed JSON response
    }

    //find all the new events that arent in yesterdays data
    var newStockingEvents = stockingDataToday.filter((item) => {
        return !stockingDataYesterday.some((item2) => item2.release_location === item.release_location);
    });

    console.log('newStockingEvents', newStockingEvents);

    // Loop through each subscription

    var toNotify = [];

    for (const subscription of subscriptions) {
        console.log('processing subscription', subscription);

        // make sure subscription.location is an array of locations
        if (!Array.isArray(subscription.locations)) {
            console.error('Error: subscription.locations is not an array');
            continue;
        }

        // iterate through each location in the subscription
        var newStock = []

        for (const location of subscription.locations) {
          //look for the location in the newStockingEvents
          const locationData = newStockingEvents.filter((item) => item.release_location === location);
          
          if (locationData.length > 0) {
            //push each item into newStock
            locationData.forEach((item) => {
              newStock.push(item);
            });
          }

        }

        if (newStock.length > 0) {
          toNotify.push({email: subscription.email, newStock: newStock})
        }
  }

  console.log('toNotify', toNotify);
  
  // Send the email
  for (const notification of toNotify) {
    const email = notification.email;
    const newStock = notification.newStock;

    const subject = `New Stocking Events for ${todaysDate}`;
    const from = 'WA Fish Stock Notifier <notifier@wa-fish-stock-notifier.com>';
    const to = [email];

    if (newStock.length > 0) {
      await sendEmail(from, to, subject, newStock);
    } else {
      console.log('No new stocking events to notify');
    }
  }
  return true
}
