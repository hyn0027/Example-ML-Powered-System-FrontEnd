'use client';

import React, { useEffect, useState } from 'react';

const TestView = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch data from the API
        fetch('http://127.0.0.1:8000/api/test/') // Replace with your actual endpoint URL
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setData(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                setError(error);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div>
            <h1>TestView Data</h1>
            <p>Name: {data.name}</p>
            <p>Age: {data.age}</p>
        </div>
    );
};

export default TestView;
