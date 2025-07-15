/**
 * Example component demonstrating TechCare API Integration
 * Shows practical usage of the new API layer
 */

'use client';

import { useState } from 'react';
import { useLogin, useCustomerRegistration, useTechnicianRegistration } from '@/lib/hooks/useAuth';
import { useAdminProfile, useTechnicianManagement } from '@/lib/hooks/useAdmin';
import { useAsyncOperation, getErrorMessage } from '@/lib/utils/errorHandling';
import { apiService } from '@/lib/services/api';

/**
 * Login Form Example
 */
export function LoginExample() {
  const { login, isLoading, error } = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await login({ email, password });
    
    if (result.success) {
      console.log('Login successful!', result.user);
      // Redirect to dashboard
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-6 border rounded-lg">
      <h2 className="text-2xl font-bold text-center">Login Example</h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          required
        />
      </div>
      
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          required
        />
      </div>
      
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}

/**
 * Registration Form Example
 */
export function RegistrationExample() {
  const { register, isLoading, error } = useCustomerRegistration();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await register(formData);
    
    if (result.success) {
      console.log('Registration successful!', result.user);
      // Redirect or show success message
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-6 border rounded-lg">
      <h2 className="text-2xl font-bold text-center">Registration Example</h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          required
        />
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          required
        />
      </div>
      
      <div>
        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
          Phone Number
        </label>
        <input
          type="tel"
          id="phoneNumber"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="+250 788 123 456"
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
        />
      </div>
      
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          required
        />
      </div>
      
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
      >
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </button>
    </form>
  );
}

/**
 * Admin Dashboard Example
 */
export function AdminDashboardExample() {
  const { fetchTechnicians, technicians, loading, error } = useTechnicianManagement();
  const { profile, fetchProfile } = useAdminProfile();

  const handleFetchTechnicians = async () => {
    await fetchTechnicians({ status: 'PENDING', page: 1, limit: 10 });
  };

  const handleFetchProfile = async () => {
    await fetchProfile();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold">Admin Dashboard Example</h2>
      
      {/* Profile Section */}
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-2">Admin Profile</h3>
        <button
          onClick={handleFetchProfile}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Load Profile
        </button>
        {profile && (
          <div className="mt-4 p-4 bg-gray-50 rounded">
            <p><strong>Name:</strong> {profile.fullName}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Role:</strong> {profile.role}</p>
          </div>
        )}
      </div>
      
      {/* Technicians Section */}
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-2">Pending Technicians</h3>
        <button
          onClick={handleFetchTechnicians}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Load Pending Technicians'}
        </button>
        
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {getErrorMessage(error)}
          </div>
        )}
        
        {technicians.length > 0 && (
          <div className="mt-4 space-y-2">
            {technicians.map((tech) => (
              <div key={tech.id} className="p-4 bg-gray-50 rounded">
                <p><strong>Name:</strong> {tech.fullName}</p>
                <p><strong>Email:</strong> {tech.email}</p>
                <p><strong>Status:</strong> {tech.status}</p>
                <p><strong>Experience:</strong> {tech.experience} years</p>
                <p><strong>Specialties:</strong> {tech.specialties.join(', ')}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Error Handling Example
 */
export function ErrorHandlingExample() {
  const { data, loading, error, execute } = useAsyncOperation();
  const [errorType, setErrorType] = useState<'network' | 'auth' | 'api'>('network');

  const simulateError = async () => {
    await execute(async () => {
      // Simulate different types of errors
      switch (errorType) {
        case 'network':
          throw new Error('Network connection failed');
        case 'auth':
          throw { statusCode: 401, message: 'Unauthorized access' };
        case 'api':
          throw { statusCode: 500, message: 'Internal server error' };
        default:
          throw new Error('Unknown error');
      }
    });
  };

  return (
    <div className="max-w-md mx-auto p-6 border rounded-lg space-y-4">
      <h2 className="text-2xl font-bold text-center">Error Handling Example</h2>
      
      <div>
        <label htmlFor="errorType" className="block text-sm font-medium text-gray-700">
          Error Type to Simulate
        </label>
        <select
          id="errorType"
          value={errorType}
          onChange={(e) => setErrorType(e.target.value as any)}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
        >
          <option value="network">Network Error</option>
          <option value="auth">Authentication Error</option>
          <option value="api">API Error</option>
        </select>
      </div>
      
      <button
        onClick={simulateError}
        disabled={loading}
        className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:opacity-50"
      >
        {loading ? 'Simulating Error...' : 'Simulate Error'}
      </button>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p><strong>Error Type:</strong> {error.type}</p>
          <p><strong>Message:</strong> {error.message}</p>
          <p><strong>User-Friendly:</strong> {getErrorMessage(error)}</p>
        </div>
      )}
      
      {data && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          Operation completed successfully!
        </div>
      )}
    </div>
  );
}

/**
 * File Upload Example (for technician registration)
 */
export function FileUploadExample() {
  const { register, isLoading, uploadProgress, error } = useTechnicianRegistration();
  const [files, setFiles] = useState<{
    profileImage?: File;
    certificateDocument?: File;
  }>({});
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
    specialties: ['Computer Repair'],
    experience: 1,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files: fileList } = e.target;
    if (fileList && fileList[0]) {
      setFiles(prev => ({
        ...prev,
        [name]: fileList[0]
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await register({
      ...formData,
      ...files,
    });
    
    if (result.success) {
      console.log('Technician registration successful!', result.user);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 border rounded-lg space-y-4">
      <h2 className="text-2xl font-bold text-center">Technician Registration with File Upload</h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      {/* Basic form fields... */}
      <div>
        <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700">
          Profile Image
        </label>
        <input
          type="file"
          id="profileImage"
          name="profileImage"
          accept="image/*"
          onChange={handleFileChange}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
        />
      </div>
      
      <div>
        <label htmlFor="certificateDocument" className="block text-sm font-medium text-gray-700">
          Certificate Document
        </label>
        <input
          type="file"
          id="certificateDocument"
          name="certificateDocument"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
        />
      </div>
      
      {isLoading && uploadProgress > 0 && (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          ></div>
          <p className="text-sm text-gray-600 mt-1">{uploadProgress}% uploaded</p>
        </div>
      )}
      
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:opacity-50"
      >
        {isLoading ? `Uploading... ${uploadProgress}%` : 'Register as Technician'}
      </button>
    </form>
  );
}

// Main demo component
export default function ApiIntegrationDemo() {
  const [activeDemo, setActiveDemo] = useState<'login' | 'register' | 'admin' | 'error' | 'upload'>('login');

  const demos = {
    login: { component: LoginExample, title: 'Login Integration' },
    register: { component: RegistrationExample, title: 'Customer Registration' },
    admin: { component: AdminDashboardExample, title: 'Admin Dashboard' },
    error: { component: ErrorHandlingExample, title: 'Error Handling' },
    upload: { component: FileUploadExample, title: 'File Upload' },
  };

  const ActiveComponent = demos[activeDemo].component;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">TechCare API Integration Demo</h1>
        
        {/* Demo navigation */}
        <div className="flex justify-center mb-8 space-x-2">
          {Object.entries(demos).map(([key, demo]) => (
            <button
              key={key}
              onClick={() => setActiveDemo(key as any)}
              className={`px-4 py-2 rounded-md font-medium ${
                activeDemo === key
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {demo.title}
            </button>
          ))}
        </div>
        
        {/* Active demo */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <ActiveComponent />
        </div>
        
        {/* API Status */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>API Base URL: {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}</p>
          <p>Authentication: {apiService.isAuthenticated() ? '✅ Authenticated' : '❌ Not authenticated'}</p>
        </div>
      </div>
    </div>
  );
}