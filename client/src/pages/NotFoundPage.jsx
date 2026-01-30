import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';
import Layout from '../components/Layout';

const NotFoundPage = () => {
  return (
    <Layout>
      <div className="min-h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-8">
            <AlertCircle className="w-24 h-24 mx-auto text-gray-400 mb-4" />
            <h1 className="text-6xl font-bold text-gray-300 mb-2">404</h1>
            <h2 className="text-2xl font-semibold text-gray-600 mb-4">Page Not Found</h2>
            <p className="text-gray-500 mb-8">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>
          
          <Link
            to="/dashboard"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            <Home className="w-5 h-5 mr-2" />
            Go to Dashboard
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default NotFoundPage;