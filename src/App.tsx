// fe/src/App.tsx

import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { useAuth } from "./context/authContext";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import LoginForm from "./components/auth/LoginForm";
import PlatformDashboard from "./components/PlatformAdminDashboard/PlatformAdminDashboard";
import PlatformUserManagement from "./components/PlatformAdminDashboard/PlatformUserManagement/PlatformUserManagement";
import PackageManagement from "./components/PlatformAdminDashboard/PackageManagement/PackageManagement";
import TenantManagement from "./components/PlatformAdminDashboard/TenantManagement/TenantManagement";
import TenantDashboard from "./components/TenantDashboard/TenantDashboard";
import SettingsPage from "./components/common/SettingsPage/SettingsPage";
import ErrorBoundary from "./utils/ErrorBoundary";
import SystemDashboard from "./components/PlatformAdminDashboard/SystemDashboard/SystemDashboard";
import FinancialHub from "./components/PlatformAdminDashboard/AccountingDashboard/FinancialHub/FinancialHub";
import AccountingDashboard from "./components/PlatformAdminDashboard/AccountingDashboard/AccountingDashboard";

// Import Tenant User Management Components
import TenantUserManagementDashboard from "./components/TenantDashboard/TenantUserManagementDashboard/TenantUserManagementDashboard";
import ViewTenantUserPage from "./components/TenantDashboard/TenantUserManagementDashboard/ViewTenantUserPage";
import RegisterTenantUserForm from "./components/TenantDashboard/TenantUserManagementDashboard/RegisterTenantUserForm";
import EditTenantUserForm from "./components/TenantDashboard/TenantUserManagementDashboard/EditTenantUserForm";
import TenantUserChangePasswordPage from "./components/TenantDashboard/TenantUserManagementDashboard/TenantUserChangePasswordPage";

// Import Tenant Client Management Components
import ClientManagementDashboard from "./components/TenantDashboard/ClientManagement/ClientManagementDashboard";
import RegisterClientForm from "./components/TenantDashboard/ClientManagement/RegisterClientForm/RegisterClientForm";
import ViewClientPage from "./components/TenantDashboard/ClientManagement/ViewClientForm/ViewClientForm";
import EditClientForm from "./components/TenantDashboard/ClientManagement/EditClientForm/EditClientForm";

// Import Loan Management Components
import LoanManagementDashboard from "./components/TenantDashboard/LoanManagement/LoanManagementDashboard";
import LoanProductsManagement from "./components/TenantDashboard/LoanManagement/LoanProductsManagement/LoanProductsManagement";
import LoanApplicationsManagement from "./components/TenantDashboard/LoanManagement/LoanApplicationsManagement/LoanApplicationsManagement";
import LoanAccountsManagement from "./components/TenantDashboard/LoanManagement/LoanAccountsManagement/LoanAccountsManagement";
import PaymentSchedulesManagement from "./components/TenantDashboard/LoanManagement/PaymentSchedulesManagement/PaymentSchedulesManagement";
import CreateLoanApplication from "./components/TenantDashboard/LoanManagement/LoanApplicationsManagement/CreateLoanApplication";
import ViewLoanApplication from "./components/TenantDashboard/LoanManagement/LoanApplicationsManagement/ViewLoanApplication";

// Import Public Pages
import LandingPage from "./Pages/LandingPage/LandingPage";
import FeaturesPricingPage from "./Pages/FeaturesPricingPage/FeaturesPricingPage";
import ContactPage from "./Pages/ContactPage/ContactPage";
import ResponsibleBorrowingPage from "./Pages/ResponsibleBorrowingPage/ResponsibleBorrowingPage";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProtectedRoute = ({
  children,
  roles,
}: {
  children: JSX.Element;
  roles: string[];
}) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/login");
      } else if (roles && !roles.includes(user.role)) {
        console.warn(`Access denied for role: ${user.role} on this page.`);
        if (user.isPlatformUser) {
          navigate("/platform/dashboard");
        } else {
          navigate("/tenant/dashboard");
        }
      }
    }
  }, [user, loading, roles, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!user || (roles && !roles.includes(user.role))) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Access denied - You don't have permission to view this page
      </div>
    );
  }

  return children;
};

// Layout component for pages that should show the navbar
const LayoutWithNavbar: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

// Layout for public pages (with navbar)
const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

// Layout for auth pages (without navbar)
const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <main>{children}</main>
    </div>
  );
};

const RootRedirector = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (user) {
        if (user.role.startsWith("platform") || user.isPlatformUser) {
          navigate("/platform/dashboard", { replace: true });
        } else {
          navigate("/tenant/dashboard", { replace: true });
        }
      } else {
        // Redirect to landing page instead of login for public access
        navigate("/home", { replace: true });
      }
    }
  }, [user, loading, navigate]);

  return (
    <div className="flex justify-center items-center h-screen">Loading...</div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="App min-h-screen bg-gray-50">
        <ErrorBoundary>
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
            theme="light"
          />

          <Routes>
            {/* Public Routes with Navbar */}
            <Route path="/home" element={
              <PublicLayout>
                <LandingPage />
              </PublicLayout>
            } />
            <Route path="/features-pricing" element={
              <PublicLayout>
                <FeaturesPricingPage />
              </PublicLayout>
            } />
            <Route path="/contact" element={
              <PublicLayout>
                <ContactPage />
              </PublicLayout>
            } />
            <Route path="/responsibleBorrowingPage" element={
              <PublicLayout>
                <ResponsibleBorrowingPage />
              </PublicLayout>
            } />

            {/* Auth Routes without Navbar */}
            <Route path="/login" element={
              <AuthLayout>
                <LoginForm />
              </AuthLayout>
            } />
            <Route path="/" element={<RootRedirector />} />

            {/* Platform Routes with Navbar */}
            <Route
              path="/platform/dashboard"
              element={
                <ProtectedRoute
                  roles={[
                    "platform_superadmin",
                    "platform_admin",
                    "platform_employee",
                  ]}
                >
                  <LayoutWithNavbar>
                    <PlatformDashboard />
                  </LayoutWithNavbar>
                </ProtectedRoute>
              }
            />

            <Route
              path="/platform/tenants"
              element={
                <ProtectedRoute
                  roles={["platform_superadmin", "platform_admin"]}
                >
                  <LayoutWithNavbar>
                    <TenantManagement />
                  </LayoutWithNavbar>
                </ProtectedRoute>
              }
            />

            <Route
              path="/platform/user-management"
              element={
                <ProtectedRoute
                  roles={["platform_superadmin", "platform_admin"]}
                >
                  <LayoutWithNavbar>
                    <PlatformUserManagement />
                  </LayoutWithNavbar>
                </ProtectedRoute>
              }
            />

            <Route
              path="/platform/packages"
              element={
                <ProtectedRoute
                  roles={["platform_superadmin", "platform_admin"]}
                >
                  <LayoutWithNavbar>
                    <PackageManagement />
                  </LayoutWithNavbar>
                </ProtectedRoute>
              }
            />

            <Route
              path="/platform/accounting"
              element={
                <ProtectedRoute
                  roles={["platform_superadmin", "platform_admin"]}
                >
                  <LayoutWithNavbar>
                    <AccountingDashboard />
                  </LayoutWithNavbar>
                </ProtectedRoute>
              }
            />

            <Route
              path="/platform/accounting/financial-hub"
              element={
                <ProtectedRoute
                  roles={["platform_superadmin", "platform_admin"]}
                >
                  <LayoutWithNavbar>
                    <FinancialHub />
                  </LayoutWithNavbar>
                </ProtectedRoute>
              }
            />

            <Route
              path="/platform/system-dashboard"
              element={
                <ProtectedRoute
                  roles={["platform_superadmin", "platform_admin"]}
                >
                  <LayoutWithNavbar>
                    <SystemDashboard />
                  </LayoutWithNavbar>
                </ProtectedRoute>
              }
            />

            {/* Tenant Routes with Navbar */}
            <Route
              path="/tenant/dashboard"
              element={
                <ProtectedRoute
                  roles={["tenant_superadmin", "admin", "employee"]}
                >
                  <LayoutWithNavbar>
                    <TenantDashboard />
                  </LayoutWithNavbar>
                </ProtectedRoute>
              }
            />

            <Route
              path="/tenant/user-management"
              element={
                <ProtectedRoute roles={["tenant_superadmin", "admin"]}>
                  <LayoutWithNavbar>
                    <TenantUserManagementDashboard />
                  </LayoutWithNavbar>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tenant/users/register"
              element={
                <ProtectedRoute roles={["tenant_superadmin", "admin"]}>
                  <LayoutWithNavbar>
                    <RegisterTenantUserForm />
                  </LayoutWithNavbar>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tenant/users/:id"
              element={
                <ProtectedRoute
                  roles={["tenant_superadmin", "admin", "employee"]}
                >
                  <LayoutWithNavbar>
                    <ViewTenantUserPage />
                  </LayoutWithNavbar>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tenant/users/:id/edit"
              element={
                <ProtectedRoute roles={["tenant_superadmin", "admin"]}>
                  <LayoutWithNavbar>
                    <EditTenantUserForm />
                  </LayoutWithNavbar>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tenant/users/:id/change-password"
              element={
                <ProtectedRoute roles={["tenant_superadmin", "admin"]}>
                  <LayoutWithNavbar>
                    <TenantUserChangePasswordPage />
                  </LayoutWithNavbar>
                </ProtectedRoute>
              }
            />

            <Route
              path="/tenant/client-management"
              element={
                <ProtectedRoute
                  roles={["tenant_superadmin", "admin", "employee"]}
                >
                  <LayoutWithNavbar>
                    <ClientManagementDashboard />
                  </LayoutWithNavbar>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tenant/clients/register"
              element={
                <ProtectedRoute roles={["tenant_superadmin", "admin"]}>
                  <LayoutWithNavbar>
                    <RegisterClientForm />
                  </LayoutWithNavbar>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tenant/clients/:id"
              element={
                <ProtectedRoute
                  roles={["tenant_superadmin", "admin", "employee"]}
                >
                  <LayoutWithNavbar>
                    <ViewClientPage />
                  </LayoutWithNavbar>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tenant/clients/:id/edit"
              element={
                <ProtectedRoute roles={["tenant_superadmin", "admin"]}>
                  <LayoutWithNavbar>
                    <EditClientForm />
                  </LayoutWithNavbar>
                </ProtectedRoute>
              }
            />

            {/* Loan Management Routes */}
            <Route
              path="/tenant/loans"
              element={
                <ProtectedRoute
                  roles={["tenant_superadmin", "admin", "employee"]}
                >
                  <LayoutWithNavbar>
                    <LoanManagementDashboard />
                  </LayoutWithNavbar>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tenant/loans/products"
              element={
                <ProtectedRoute
                  roles={["tenant_superadmin", "admin", "employee"]}
                >
                  <LayoutWithNavbar>
                    <LoanProductsManagement />
                  </LayoutWithNavbar>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tenant/loans/applications"
              element={
                <ProtectedRoute
                  roles={["tenant_superadmin", "admin", "employee"]}
                >
                  <LayoutWithNavbar>
                    <LoanApplicationsManagement />
                  </LayoutWithNavbar>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tenant/loans/applications/new"
              element={
                <ProtectedRoute roles={["tenant_superadmin", "admin"]}>
                  <LayoutWithNavbar>
                    <CreateLoanApplication />
                  </LayoutWithNavbar>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tenant/loans/applications/:id"
              element={
                <ProtectedRoute
                  roles={["tenant_superadmin", "admin", "employee"]}
                >
                  <LayoutWithNavbar>
                    <ViewLoanApplication />
                  </LayoutWithNavbar>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tenant/loans/accounts"
              element={
                <ProtectedRoute
                  roles={["tenant_superadmin", "admin", "employee"]}
                >
                  <LayoutWithNavbar>
                    <LoanAccountsManagement />
                  </LayoutWithNavbar>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tenant/loans/payments"
              element={
                <ProtectedRoute
                  roles={["tenant_superadmin", "admin", "employee"]}
                >
                  <LayoutWithNavbar>
                    <PaymentSchedulesManagement />
                  </LayoutWithNavbar>
                </ProtectedRoute>
              }
            />

            {/* Settings Route - Accessible to all authenticated users */}
            <Route
              path="/settings"
              element={
                <ProtectedRoute
                  roles={[
                    "platform_superadmin",
                    "platform_admin",
                    "platform_employee",
                    "tenant_superadmin",
                    "admin",
                    "employee",
                  ]}
                >
                  <LayoutWithNavbar>
                    <SettingsPage />
                  </LayoutWithNavbar>
                </ProtectedRoute>
              }
            />

            {/* 404 Page */}
            <Route
              path="*"
              element={
                <PublicLayout>
                  <div className="flex justify-center items-center h-screen">
                    <div className="text-center">
                      <h1 className="text-4xl font-bold text-gray-800 mb-4">
                        404
                      </h1>
                      <p className="text-xl text-gray-600">Page Not Found</p>
                    </div>
                  </div>
                </PublicLayout>
              }
            />
          </Routes>
        </ErrorBoundary>
      </div>
    </Router>
  );
};

export default App;