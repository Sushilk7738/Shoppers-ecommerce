import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
            
            <h1 className="text-6xl font-extrabold text-red-500 mb-4">
                404
            </h1>

            <p className="text-xl md:text-2xl text-gray-700 mb-2">
                Page Not Found
            </p>

            <p className="text-gray-500 max-w-md mb-6">
                The page you’re looking for doesn’t exist or was moved.
            </p>

            <Link
                to="/"
                className="px-6 py-3 bg-cyan-600 text-white rounded-lg
                        hover:bg-cyan-700 transition font-semibold"
            >
                Go Back Home
            </Link>
        </div>
    );
};

export default NotFound;
