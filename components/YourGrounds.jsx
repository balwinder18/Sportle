import { useState, useEffect } from 'react';

const YourGrounds = () => {
    const [grounds, setGrounds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchGrounds = async () => {
        try {
          const response = await fetch('/api/getgrounds');
          if (!response.ok) {
            throw new Error('Failed to fetch grounds');
          }
          
          const data = await response.json();
          console.log('API response:', data);
          
          
          const groundsArray = Array.isArray(data) ? data : [data];
          setGrounds(groundsArray);
          setLoading(false);
        } catch (err) {
          console.error('Error fetching grounds:', err);
          setError(err.message);
          setLoading(false);
        }
      };
  
      fetchGrounds();
    }, []);
  
    if (loading) {
      return <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>;
    }
  
    if (error) {
      return <div className="text-center text-red-500 p-4">Error: {error}</div>;
    }
  
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Your Grounds</h1>
        {grounds.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {grounds.map((ground) => (
              <div key={ground._id} className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
                <h2 className="text-xl font-semibold mb-2">{ground.name}</h2>
                <p className="text-gray-600 mb-2">{ground.description}</p>
                <p className="text-sm text-gray-500">Location: {ground.location}</p>
                {/* <p className="text-xs text-gray-400 mt-2">ID: {ground._id}</p> */}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500 mb-4">No grounds found.</p>
            <a href="/newground" className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Add New Ground
            </a>
          </div>
        )}
      </div>
    );
  };
  
export default YourGrounds;