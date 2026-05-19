import { useState } from 'react';
import { FiAlertCircle, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { progress as progressApi } from '../../services/backendApi';
import { submitProgress } from '../../services/socketClient';

export default function ProgressSubmissionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    value: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.value) {
      newErrors.value = 'Progress value is required';
    } else if (isNaN(formData.value) || Number(formData.value) < 0) {
      newErrors.value = 'Progress value must be a positive number';
    }

    if (formData.notes && formData.notes.length > 500) {
      newErrors.notes = 'Notes cannot exceed 500 characters';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await progressApi.submit({
        challengeId: id,
        value: Number(formData.value),
        notes: formData.notes,
      });

      submitProgress(id, user.uid, Number(formData.value), response.data.points || 10);
      setSuccess(true);
      setFormData({ value: '', notes: '' });

      setTimeout(() => {
        navigate(`/challenges/${id}`);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit progress');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate(`/challenges/${id}`)}
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8"
        >
          <FiArrowLeft className="mr-2" />
          Back to challenge
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Submit Progress</h1>
          <p className="text-gray-600 mb-8">
            Record your fitness progress for this challenge
          </p>

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
              <FiCheckCircle className="text-green-600 mt-0.5 flex-shrink-0 text-xl" />
              <div>
                <p className="text-green-700 font-semibold">Success!</p>
                <p className="text-green-600 text-sm">Progress submitted. Redirecting...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <FiAlertCircle className="text-red-600 mt-0.5 flex-shrink-0 text-xl" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-2">
                Progress Value
                <span className="text-red-500">*</span>
              </label>
              <input
                id="value"
                type="number"
                name="value"
                value={formData.value}
                onChange={handleChange}
                placeholder="e.g., 50 (kilometers, reps, minutes, etc.)"
                step="0.1"
                min="0"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
                  errors.value ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.value && (
                <p className="text-red-600 text-sm mt-1">{errors.value}</p>
              )}
              <p className="text-gray-500 text-sm mt-1">
                Enter any numeric value (kilometers, repetitions, minutes, etc.)
              </p>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Add any notes about your workout..."
                maxLength="500"
                rows="4"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none ${
                  errors.notes ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <div className="flex justify-between items-center mt-1">
                {errors.notes && (
                  <p className="text-red-600 text-sm">{errors.notes}</p>
                )}
                <p className="text-gray-500 text-sm ml-auto">
                  {formData.notes.length}/500
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                {loading ? 'Submitting...' : 'Submit Progress'}
              </button>
              <button
                type="button"
                onClick={() => navigate(`/challenges/${id}`)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
