import { createContext, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearUser } from './store/userSlice';
import Layout from './Layout';
import { routeArray } from './config/routes';
import NotFound from './components/pages/NotFound';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Callback from './pages/Callback';
import ErrorPage from './pages/ErrorPage';
import ResetPassword from './pages/ResetPassword';
import PromptPassword from './pages/PromptPassword';

// Create auth context
export const AuthContext = createContext(null);

function AppContent() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Get authentication status with proper error handling
  const userState = useSelector((state) => state.user);
  const isAuthenticated = userState?.isAuthenticated || false;
  
// Initialize ApperUI once when the app loads
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check if Apper SDK is loaded
        if (!window.ApperSDK) {
          console.error("Apper SDK not loaded. Please check:");
          console.error("1. VITE_APPER_SDK_CDN_URL is set in .env file");
          console.error("2. The SDK script is loading properly in index.html");
          console.error("3. Network connectivity to the SDK CDN");
          
          // Initialize without authentication
          setIsInitialized(true);
          navigate('/login');
          return;
        }

        // Check environment variables
        const projectId = import.meta.env.VITE_APPER_PROJECT_ID;
        const publicKey = import.meta.env.VITE_APPER_PUBLIC_KEY;
        
        if (!projectId || !publicKey) {
          console.error("Missing environment variables:");
          if (!projectId) console.error("- VITE_APPER_PROJECT_ID is not set");
          if (!publicKey) console.error("- VITE_APPER_PUBLIC_KEY is not set");
          console.error("Please check your .env file");
          
          // Initialize without authentication
          setIsInitialized(true);
          navigate('/login');
          return;
        }

        const { ApperClient, ApperUI } = window.ApperSDK;
        
        const client = new ApperClient({
          apperProjectId: projectId,
          apperPublicKey: publicKey
        });
        
        // Initialize but don't show login yet
        ApperUI.setup(client, {
          target: '#authentication',
          clientId: projectId,
          view: 'both',
          onSuccess: function (user) {
            setIsInitialized(true);
            // CRITICAL: This exact currentPath logic must be preserved in all implementations
            // DO NOT simplify or modify this pattern as it ensures proper redirection flow
            let currentPath = window.location.pathname + window.location.search;
            let redirectPath = new URLSearchParams(window.location.search).get('redirect');
            const isAuthPage = currentPath.includes('/login') || currentPath.includes('/signup') || 
                               currentPath.includes('/callback') || currentPath.includes('/error') || 
                               currentPath.includes('/prompt-password') || currentPath.includes('/reset-password');
            
            if (user) {
              // User is authenticated
              if (redirectPath) {
                navigate(redirectPath);
              } else if (!isAuthPage) {
                if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
                  navigate(currentPath);
                } else {
                  navigate('/');
                }
              } else {
                navigate('/');
              }
              // Store user information in Redux
              dispatch(setUser(JSON.parse(JSON.stringify(user))));
            } else {
              // User is not authenticated
              if (!isAuthPage) {
                navigate(
                  currentPath.includes('/signup')
                    ? `/signup?redirect=${currentPath}`
                    : currentPath.includes('/login')
                    ? `/login?redirect=${currentPath}`
                    : '/login'
                );
              } else if (redirectPath) {
                if (
                  !['error', 'signup', 'login', 'callback', 'prompt-password', 'reset-password'].some((path) => currentPath.includes(path))
                ) {
                  navigate(`/login?redirect=${redirectPath}`);
                } else {
                  navigate(currentPath);
                }
              } else if (isAuthPage) {
                navigate(currentPath);
              } else {
                navigate('/login');
              }
              dispatch(clearUser());
            }
          },
          onError: function(error) {
            console.error("Authentication failed:", error);
            setIsInitialized(true);
            navigate('/login');
          }
        });
        
      } catch (error) {
        console.error("Failed to initialize Apper SDK:", error);
        console.error("The app will continue without authentication");
        setIsInitialized(true);
        navigate('/login');
      }
    };

    initializeApp();
  }, [navigate, dispatch]);// No props and state should be bound
  
  // Authentication methods to share via context
  const authMethods = {
    isInitialized,
    logout: async () => {
      try {
        const { ApperUI } = window.ApperSDK;
        await ApperUI.logout();
        dispatch(clearUser());
        navigate('/login');
      } catch (error) {
        console.error("Logout failed:", error);
      }
    }
  };
  
  // Don't render routes until initialization is complete
  if (!isInitialized) {
    return <div className="loading flex items-center justify-center p-6 h-full w-full"><svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" ><path d="M12 2v4"></path><path d="m16.2 7.8 2.9-2.9"></path><path d="M18 12h4"></path><path d="m16.2 16.2 2.9 2.9"></path><path d="M12 18v4"></path><path d="m4.9 19.1 2.9-2.9"></path><path d="M2 12h4"></path><path d="m4.9 4.9 2.9 2.9"></path></svg></div>;
  }
  
  return (
    <AuthContext.Provider value={authMethods}>
      <div className="h-screen flex flex-col overflow-hidden">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="/prompt-password/:appId/:emailAddress/:provider" element={<PromptPassword />} />
          <Route path="/reset-password/:appId/:fields" element={<ResetPassword />} />
          <Route path="/" element={<Layout />}>
            {routeArray.map((route) => (
              <Route
                key={route.id}
                path={route.path}
                element={<route.component />}
              />
            ))}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          className="z-[9999]"
        />
      </div>
    </AuthContext.Provider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;