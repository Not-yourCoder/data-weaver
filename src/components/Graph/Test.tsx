import { useEffect, useState } from 'react';

function Test() {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch('http://localhost:6969/api/data')
            .then(response => response.json())
            .then(data => setData(data))
            .catch(err => console.error('Error fetching data:', err));
    }, []);

    return (
        <div>
            <h1>Data from Neo4j</h1>
            <ul className='text-red-600 text-lg font-mono'>
                {data.length === 0 ? "Nothing in here": JSON.stringify(data)}
            </ul>
        </div>
    );
}

export default Test;
