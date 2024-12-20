'use client'
import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';


const SubscriptionForm = () => {
    const supabase = createClient();

    const [email, setEmail] = useState('');
    const [lakes, setLakes] = useState([]);
    const [feedbackMessage, setFeedbackMessage] = useState(''); // For feedback messages
    const [isError, setIsError] = useState(false); // To track if the feedback is an error or success
    const [isSubmitted, setIsSubmitted] = useState(false); // To track form submission
    const [locations, setLocations] = useState([]);


    const [counties, setCounties] = useState([]);
    const [selectedCounty, setSelectedCounty] = useState('');

    async function getCountiesFromSupabase() {
        supabase.from('county').select('*').then((response) => {
            if (response.error) {
                console.error('Error fetching counties:', response.error);
            } else {
                setCounties(response.data);
            }
        });
    }


    async function getLocationsFromSupabase() {
        supabase.from('location').select('*').then((response) => {
            if (response.error) {
                console.error('Error fetching locations:', response.error);
            } else {
                setLocations(response.data);
            }
        });
    }

    useEffect(() => {
        getLocationsFromSupabase();
        getCountiesFromSupabase();
    }, []);

    function getNameFromLocation(location) {
        return locations.find((loc) => loc.key === location).location
    }

    function handleSubmit(e) {
        e.preventDefault();

        var newSubscription = {
            email: email,
            locations: lakes
        };

        // Insert the new subscription into the database 'subscription' table
        supabase
            .from('subscription')
            .insert(newSubscription)
            .then((response) => {
                if (response.error && response.status === 409) {
                    // Duplicate entry
                    setIsError(true);
                    setFeedbackMessage('You are already subscribed with this email address.');
                } else if (response.error) {
                    // Some other error
                    setIsError(true);
                    setFeedbackMessage('An error occurred while adding your subscription.');
                } else {
                    // Success case
                    setIsError(false);
                    setFeedbackMessage('Subscription added successfully!');
                    setIsSubmitted(true); // Transition to confirmation
                }
            })
            .catch((error) => {
                console.error('Error adding subscription:', error);
                setIsError(true);
                setFeedbackMessage('An unexpected error occurred.');
            });
    }

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

    function getNameFromLocation(location) {
        return locations.find((loc) => loc.location === location)?.description || location;
    }

    //get just the location values for all locations in an array
    function getLocations() {
        return locations.map((location) => location.location);
    }

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full">
                {/* Form or Confirmation */}
                {isSubmitted ? (
                    <div>
                        <h2 className="text-2xl font-semibold mb-1 text-green-700">Subscription Confirmed!</h2>
                        <p className="text-black text-md font-medium mb-5">Thank you for subscribing.</p>
                        <p className="text-black text-sm mt-2">
                            <strong>Email:</strong> {email}
                        </p>

                        <div className="text-black text-sm mt-2">
                            <strong>Subscribed Locations:</strong>
                            <ul className="mt-1 list-disc list-inside">
                                {
                                    lakes.map((lake, index) => (
                                        <li key={index}>{getNameFromLocation(lake)}</li>
                                    ))

                                }
                            </ul>
                        </div>

                        <div className="text-black text-sm mt-5 flex justify-center items-center mb-0">
                            Please donate to support future development!
                        </div>
                        <div className="mt-0 flex justify-center items-center">
                            
                            <a href="https://ko-fi.com/J3J714R6RN" target="_blank" rel="noopener noreferrer">
                                <img
                                height="36"
                                style={{ border: "0px", height: "50px", marginTop: "10px" }}
                                src="https://storage.ko-fi.com/cdn/kofi2.png?v=3"
                                alt="Buy Me a Coffee at ko-fi.com"
                                />
                            </a>
                        </div>

                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <h2 className="text-2xl font-semibold mb-1 text-green-700">Get notified!</h2>
                        <h5 className="text-sm text-gray-500 mb-4">Get an email when your lake is stocked with fish.</h5>

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

                        <div>
                            <label
                                htmlFor="county"
                                className="block text-black text-sm font-medium"
                            >County</label>
                            <select
                                id="county"
                                required
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                value={selectedCounty}
                                onChange={(e) => setSelectedCounty(e.target.value)}
                            >
                                <option value="">All</option>
                                {counties?.map((county) => (
                                    <option key={county.id} value={county.county}>
                                        {county.county}
                                    </option>
                                ))}
                            </select>
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
                                {locations?.filter(
                                    (location) => location.county === selectedCounty || selectedCounty === ''
                                ).filter((a) => a.description)?.map((location) => (
                                    <option key={location.location} value={location.location}>
                                        {location.description} - {location.county}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-green-700 text-white font-semibold rounded-md shadow hover:bg-green-800 transition-colors"
                        >
                            Submit
                        </button>

                        {/* Feedback Message */}
                        {feedbackMessage && (
                            <div
                                className={`mt-4 p-2 rounded ${
                                    isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                                }`}
                            >
                                {feedbackMessage}
                            </div>
                        )}
                    </form>
                )}
            </div>
        </div>
    );
};

export default SubscriptionForm;
