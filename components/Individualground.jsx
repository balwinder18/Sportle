'use client'


import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, CalendarDays, Clock, CheckCircle, XCircle, ArrowLeft, Edit, Trash2, Share2, Star, Users, DollarSign, Mail, Phone } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';

const Individualground = () => {
    
    const{ id} = useParams();
  const { data: session } = useSession();
  const [ground, setGround] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);

  const fetchGroundDetail = async () => {
    if (!id){
        console.log("is not founmddddd");
    }

    try {
      const response = await axios.get(`/api/groundDetails/${id}`);
      


      
      console.log(response.data);
      setGround(response.data);
      console.log(ground);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching ground details:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
  

    fetchGroundDetail();
  }, []);

  useEffect(() => {
  

    console.log(ground);
  }, [ground]);

  const handleDelete = async () => {
    if (!id || !session) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/ground/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete ground');
      }

      router.push('/grounds');
    } catch (err) {
      console.error('Error deleting ground:', err);
      setError(err.message);
      setLoading(false);
      setDeleteModal(false);
    }
  };

//   const handleShare = () => {
//     if (navigator.share) {
//       navigator.share({
//         title: ground.name,
//         text: `Check out this sports ground: ${ground.name}`,
//         url: window.location.href,
//       });
//     } else {
//       navigator.clipboard.writeText(window.location.href);
//       // Show toast notification (implementation depends on your toast system)
//       alert('Link copied to clipboard!');
//     }
//   };

  if (!session) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center p-8 rounded-lg shadow-md bg-white">
          <Clock className="h-8 w-8 animate-spin mx-auto text-blue-500 mb-4" />
          <p className="text-gray-600 font-medium">Loading session...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center p-8 rounded-lg shadow-md bg-white">
          <Clock className="h-8 w-8 animate-spin mx-auto text-blue-500 mb-4" />
          <p className="text-gray-600 font-medium">Loading ground details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center p-8 rounded-lg shadow-md bg-white border-l-4 border-red-500">
          <XCircle className="h-8 w-8 mx-auto text-red-500 mb-4" />
          <p className="text-red-500 font-medium mb-2">Error Occurred</p>
          <p className="text-gray-600">{error}</p>
          <div className="mt-6 flex justify-center space-x-4">
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
            >
              Try Again
            </button>
            <Link 
              href="/"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Back to Grounds
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!ground) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center p-8 rounded-lg shadow-md bg-white">
          <XCircle className="h-8 w-8 mx-auto text-amber-500 mb-4" />
          <p className="text-gray-800 font-medium mb-2">Ground Not Found</p>
          <p className="text-gray-600 mb-6">This ground may have been removed or you don't have access to it.</p>
          <Link 
            href="/grounds"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Back to Grounds
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-5xl">
      
        <div className="mb-6">
          <Link 
            href="/grounds" 
            className="inline-flex items-center text-blue-500 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span>Back to all grounds</span>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="h-64 bg-blue-100 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <MapPin className="h-16 w-16 text-blue-300" />
            </div>

            <div className="absolute top-4 right-4">
              {ground.Approval === "yes" ? (
                <span className="flex items-center bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Approved
                </span>
              ) : (
                <span className="flex items-center bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium">
                  <Clock className="h-4 w-4 mr-1" />
                  Pending Approval
                </span>
              )}
            </div>
          </div>

          <div className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{ground.name}</h1>
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="h-5 w-5 mr-2 text-gray-500" />
                  <span>{ground.location}</span>
                </div>
              </div>

              <div className="flex space-x-3 mt-4 lg:mt-0">
                {/* <button 
                  onClick={handleShare}
                  className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  <span>Share</span>
                </button> */}
                <Link 
                  href={`/grounds/edit/${id}`}
                  className="flex items-center px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  <span>Edit</span>
                </Link>
                <button 
                  onClick={() => setDeleteModal(true)}
                  className="flex items-center px-3 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  <span>Delete</span>
                </button>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Description</h2>
              <p className="text-gray-600 whitespace-pre-line mb-6">{ground.description}</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Star className="h-5 w-5 mr-2 text-blue-500" />
              Facilities
            </h2>
            <ul className="space-y-2">
              {ground.facilities ? (
                ground.facilities.map((facility, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{facility}</span>
                  </li>
                ))
              ) : (
                <li className="text-gray-500">No facilities information available</li>
              )}
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Users className="h-5 w-5 mr-2 text-blue-500" />
              Capacity & Pricing
            </h2>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">Capacity</div>
                <div className="text-lg font-medium text-gray-700">
                  {ground.capacity || 'Not specified'} people
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Pricing</div>
                <div className="flex items-center text-lg font-medium text-gray-700">
                  <DollarSign className="h-5 w-5 mr-1 text-green-600" />
                  {ground.price ? `${ground.price} per hour` : 'Not specified'}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Mail className="h-5 w-5 mr-2 text-blue-500" />
              Contact Information
            </h2>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">Email</div>
                <div className="text-gray-700">
                  {ground.email || 'Not provided'}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Phone</div>
                <div className="flex items-center text-gray-700">
                  <Phone className="h-4 w-4 mr-2 text-gray-500" />
                  {ground.phone || 'Not provided'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <CalendarDays className="h-5 w-5 mr-2 text-blue-500" />
            Availability
          </h2>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
            <p className="text-gray-500">
              Calendar integration will be available soon. Contact the ground owner for availability.
            </p>
          </div>
        </div>
      </div>

      {deleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Delete Ground</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{ground.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button 
                onClick={() => setDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default Individualground;