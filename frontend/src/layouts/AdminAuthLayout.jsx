import { FaShieldAlt } from 'react-icons/fa';
import { Outlet } from 'react-router-dom';

const AdminAuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <FaShieldAlt className="mx-auto h-12 w-auto text-blue-400" />
          <h2 className="mt-6 text-3xl font-extrabold text-white">Admin Portal</h2>
          <p className="mt-2 text-sm text-gray-400">
            FitNova Administration Dashboard
          </p>
        </div>

        <div className="mt-8 bg-slate-800 py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-slate-700">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminAuthLayout;
