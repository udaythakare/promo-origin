import { FaExclamationTriangle } from 'react-icons/fa';

const ErrorPage = ({ error }) => {
  console.error('Full authentication error:', error);

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full border border-blue-100">
        <div className="flex items-center space-x-4 mb-6">
          <FaExclamationTriangle className="text-blue-500 text-3xl" />
          <h1 className="text-2xl font-semibold text-blue-800">Authentication Error</h1>
        </div>
        <p className="text-blue-700">
          {error?.message || 'An unexpected error occurred. Please try again or contact support.'}
        </p>
        <div className="mt-6">
          <a
            href="/"
            className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Go Back Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
