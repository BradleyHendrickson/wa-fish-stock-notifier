"use server"
import { createClient } from '@/utils/supabase/server';
import { EmailTemplate } from '@/components/EmailTemplate';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const appToken = process.env.WDFW_DATA_APP_TOKEN;

/* 
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
export async function GET(request: NextRequest, response: NextResponse) {
const cookieStore = cookies()

const supabase = createServerClient(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.SUPABASE_SERVICE_ROLE_KEY!,
{
cookies: {
get(name: string) {
return cookieStore.get(name)?.value
},
},
}
)
*/

// Utility function to check if a stocking event is new
function isNewRelease(releaseStartDate, lastStockedDate) {
    const releaseDate = new Date(releaseStartDate);
    return releaseDate > new Date(lastStockedDate);
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

export default async function processSubscriptions(client) {
    const supabase = createClient();

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
    var toNotify = [];

    console.log('subscriptions', subscriptions)
    console.log('lastStocked', lastStocked)

    // Loop through each subscription
    for (const subscription of subscriptions) {
        console.log('processing subscription for', subscription.email);

        // make sure subscription.location is an array of locations
        if (!Array.isArray(subscription.locations)) {
            console.error('Error: subscription.locations is not an array');
            continue;
        }

        // iterate through each location in the subscription
        for (const location of subscription.locations) {
            console.log('processing location', location);

            // Fetch the latest stocking data for the location
            const response = await fetch(`https://data.wa.gov/resource/6fex-3r7d.json?release_location=${location}`, {
                headers: {
                  'X-App-Token': appToken // using the app token reduces throttling
                }
              });
              

            var stockingData

            if (!response.ok) {
                const stockingError = `Error: ${response.status} ${response.statusText}`;
                console.error(stockingError);
            } else {
                stockingData = await response.json();
                console.log('data for ', location, stockingData); // Now stockingData contains the parsed JSON response
            }    
            
            

                
            const latestStocking = stockingData.length > 0 ? stockingData.reduce((prev, current) => (new Date(prev.release_end_date) > new Date(current.release_end_date)) ? prev : current) : null;
            console.log('latestStocking', latestStocking);

            // Find the last stocked date for the location
            const lastStockedLocation = lastStocked.find((item) => item.location === location);

            console.log('lastStockedLocation', lastStockedLocation);



            // If the location is in the lastStocked table, update it
            if (lastStockedLocation && latestStocking) {
                console.log('Location found in lastStocked table, updating it', lastStockedLocation);
                
                const updateData = {
                    last_checked: new Date(),
                    last_stocked_info: latestStocking,
                    last_stocked: latestStocking.release_end_date
                };
                
                // Assuming `location` is the unique identifier in your table
                const { error } = await supabase
                    .from('last_stocked')
                    .update(updateData)
                    .eq('location', lastStockedLocation.location);
                
                if (error) {
                    console.error('Error updating lastStockedLocation:', error);
                } else {
                    console.log('Successfully updated lastStockedLocation');
                }
            }


            // If the location is not in the lastStocked table, add it
            else if (!lastStockedLocation && latestStocking) {
                console.log('location not found in lastStocked table, adding it');
                const newLastStocked = {
                    location: location,
                    last_stocked: latestStocking.release_end_date,
                    last_checked: new Date(),
                    last_stocked_info: latestStocking
                };
                await supabase.from('last_stocked').insert(newLastStocked);

                //update lastStocked array
                lastStocked.push(newLastStocked);
            }

            // Check if the latest stocking event is new
            if ((!lastStockedLocation || isNewRelease(latestStocking.release_start_date.substring(0,10), lastStockedLocation?.last_stocked)) && latestStocking) {
                console.log('new stocking event found for', location);
                console.log(latestStocking.release_start_date, lastStockedLocation?.last_stocked, isNewRelease(latestStocking.release_start_date, lastStockedLocation?.last_stocked));
                toNotify.push({ location: location, stockingEvent: latestStocking });
            }

        }
    }

    // Send email notifications
    console.log('toNotify', toNotify);

    // loop through all email addressses, and see if their subscription location is in the toNotify array
    for (const subscription of subscriptions) {
        console.log('processing subscription for', subscription.email);

        var stockingEvents = [];

        for (const location of subscription.locations) {
            const found = toNotify.find((item) => item.location === location);
            if (found) {
                console.log('sending email to', subscription.email, 'for location', location);

                // create a row in email_queue which has columns to_email, data, sent (boolean)
                const newEmail = {
                    to_email: subscription.email,
                    data: found,
                    sent: false
                };
                await supabase.from('email_queue').insert(newEmail);

                // add the stocking event to the stockingEvents array
                stockingEvents.push(found.stockingEvent)


            }
        }

``      // generate the email and send it
        const from = 'WA Fish Stock Notifier <notifier@wa-fish-stock-notifier.com>';
        const to = [subscription.email];
        const subject = `Stocking Event Notification`;

        if (stockingEvents.length > 0) {
            console.log('sending email for', subscription.email);
            await sendEmail(from, to, subject, stockingEvents);
        } else {
            console.log('no new stocking events to send for', subscription.email);
        }
    }

    return toNotify;
   
}
