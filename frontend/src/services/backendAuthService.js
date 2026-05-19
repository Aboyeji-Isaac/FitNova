import { auth as authApi, getAuthToken, onboarding, setAuthToken } from './backendApi';

class BackendAuthService {
  async signup(userData) {
    try {
      const response = await authApi.signup({
        email: userData.email,
        password: userData.password,
        displayName: userData.displayName,
      });

      if (response.data.customToken) {
        setAuthToken(response.data.customToken);
      }

      return {
        success: true,
        user: {
          uid: response.data.uid,
          email: response.data.email,
          displayName: response.data.displayName,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Signup failed',
      };
    }
  }

  async login(credentials) {
    try {
      const response = await authApi.login({
        email: credentials.email,
        password: credentials.password,
      });

      if (response.data.customToken) {
        setAuthToken(response.data.customToken);
      }

      return {
        success: true,
        user: {
          uid: response.data.uid,
          email: response.data.email,
          displayName: response.data.displayName,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed',
      };
    }
  }

  async logout() {
    try {
      await authApi.logout();
      setAuthToken(null);
      return { success: true };
    } catch (error) {
      setAuthToken(null);
      return { success: true };
    }
  }

  async getCurrentUser() {
    try {
      const token = getAuthToken();
      if (!token) return null;

      const response = await authApi.getCurrentUser();
      return response.data;
    } catch (error) {
      setAuthToken(null);
      return null;
    }
  }

  async updateProfile(data) {
    try {
      const response = await authApi.getCurrentUser();
      const currentUser = response.data;

      await onboarding.completeSetup(data);

      return {
        success: true,
        user: { ...currentUser, ...data },
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Profile update failed',
      };
    }
  }

  async verifyToken(token) {
    try {
      const response = await authApi.verifyToken(token);
      return { valid: response.data.valid };
    } catch (error) {
      return { valid: false };
    }
  }
}

export default new BackendAuthService();
