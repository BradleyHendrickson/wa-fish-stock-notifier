'use client'
import React, { useState } from 'react';
import { createClient } from '@/utils/supabase/client';

const SubscriptionForm = () => {
    const supabase = createClient();

    const [email, setEmail] = useState('');
    const [lakes, setLakes] = useState([]);

    function handleSubmit(e) {
        e.preventDefault();

        console.log('Email:', email);
        console.log('Selected Lakes:', lakes);

        var newSubscription = {
            email: email,
            locations: lakes
        };

        // Insert the new subscription into the database 'subscription' table
        supabase
            .from('subscription')
            .insert(newSubscription)
            .then((response) => {
                console.log('Subscription added successfully:', response);
            })
            .catch((error) => {
                console.error('Error adding subscription:', error);
            });
            /*
            TODO:
            Implement error message, if the email already exists in the database.
            Confirm with user that they will be updating their subscription
            {
                "error": {
                    "code": "23505",
                    "details": null,
                    "hint": null,
                    "message": "duplicate key value violates unique constraint \"subscription_email_key\""
                },
                "data": null,
                "count": null,
                "status": 409,
                "statusText": ""
            }
            */
    };

    // Handle multiple selections
    function handleLakeChange(e) {
        const options = e.target.options;
        const selectedLakes = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                selectedLakes.push(options[i].value);
            }
        }
        setLakes(selectedLakes);
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full">
                <h2 className="text-2xl font-semibold mb-1 text-green-700">Get notified!</h2>
                <h5 className="text-sm text-gray-500 mb-4">Get an email when your lake is stocked with fish.</h5>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className="block text-black text-sm font-medium">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    {/* Lake Multi-Select Dropdown */}
                    <div>
                        <label htmlFor="lake" className="block text-black text-sm font-medium">
                            Select locations to subscribe to
                        </label>
                        <select
                            id="lake"
                            multiple
                            value={lakes}
                            onChange={handleLakeChange}
                            required
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            <option value="BATTLE GROUND LK (CLAR)">Battle Ground Lake</option>
                            <option value="KLINELINE PD (CLAR)">Klineline Pond</option>
                            <option value="LEWIS R -NF  27.0168">North Fork, Lewis River</option>
                            <option value="COWLITZ R    26.0002">Cowlitz River</option>
                            <option value="FORK CR      24.0356">Fork Creek</option>
                        </select>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-green-700 text-white font-semibold rounded-md shadow hover:bg-green-800 transition-colors"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SubscriptionForm;
