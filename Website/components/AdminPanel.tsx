'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRealtimeData, useFirebaseMutation } from '@/hooks/useFirebase';
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Cpu,
  Link2,
  Unlink,
  PlusCircle,
  Search,
  Filter,
  ShieldCheck,
  AlertCircle,
  ChevronRight,
  MapPin,
  Mail,
  Building,
  RefreshCw,
  Sprout,
  Zap,
  Check,
  X,
  Radio,
  Sparkles,
  Lock,
  Eye,
  EyeOff,
  LogOut,
  ShieldAlert,
  UserCheck,
  Menu
} from 'lucide-react';

export interface Customer {
  id: string;
  name: string;
  email: string;
  contactPerson: string;
  phone: string;
  status: 'pending' | 'approved' | 'rejected';
  registeredAt: string;
  facilityType: string;
  location: string;
  circuits?: string[];
  notes?: string;
  rejectionReason?: string;
}

export interface Circuit {
  id: string;
  circuitId: string;
  name: string;
  model: string;
  assignedCustomerId?: string | null;
  assignedCustomerName?: string | null;
  status: 'online' | 'offline' | 'unassigned';
  location: string;
  registeredAt: string;
}

export default function AdminPanel() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authChecking, setAuthChecking] = useState<boolean>(true);
  const [adminEmail, setAdminEmail] = useState<string>('');
  const [adminPassword, setAdminPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [loginSubmitting, setLoginSubmitting] = useState<boolean>(false);
  const [authenticatedUserEmail, setAuthenticatedUserEmail] = useState<string>('');

  // Check existing session on mount
  useEffect(() => {
    const sessionAuth = localStorage.getItem('gravity_admin_auth');
    const storedEmail = localStorage.getItem('gravity_admin_email');
    if (sessionAuth === 'true' && storedEmail) {
      setIsAuthenticated(true);
      setAuthenticatedUserEmail(storedEmail);
    }
    setAuthChecking(false);
  }, []);

  // Firebase Realtime Hooks
  const { data: rawCustomers, loading: loadingCustomers } = useRealtimeData('customers');
  const { data: rawCircuits, loading: loadingCircuits } = useRealtimeData('circuits');
  const { updateData, writeData } = useFirebaseMutation();

  // Navigation & UI States
  const [activeTab, setActiveTab] = useState<'customers' | 'circuits'>('customers');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  
  // Selected Customer Modal State
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  
  // Reject Reason Modal State
  const [rejectingCustomerId, setRejectingCustomerId] = useState<string | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');

  // Add Circuit Modal State
  const [showAddCircuitModal, setShowAddCircuitModal] = useState(false);
  const [newCircuitId, setNewCircuitId] = useState('');
  const [newCircuitName, setNewCircuitName] = useState('');
  const [newCircuitModel, setNewCircuitModel] = useState('Gravity IoT Controller v2');
  const [newCircuitLocation, setNewCircuitLocation] = useState('Greenhouse Bay A');
  const [newCircuitCustomerTarget, setNewCircuitCustomerTarget] = useState<string>('');

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Handle Admin Login Form Submission
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setLoginSubmitting(true);

    setTimeout(() => {
      const targetEmail = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@gravity.io').trim().toLowerCase();
      const targetPassword = (process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123').trim();

      const inputEmail = adminEmail.trim().toLowerCase();
      const inputPassword = adminPassword.trim();

      if (inputEmail === targetEmail && inputPassword === targetPassword) {
        localStorage.setItem('gravity_admin_auth', 'true');
        localStorage.setItem('gravity_admin_email', inputEmail);
        setIsAuthenticated(true);
        setAuthenticatedUserEmail(inputEmail);
        showToast('Successfully authenticated as Enterprise Administrator', 'success');
      } else {
        setAuthError('Invalid administrator email or password. Please verify your credentials.');
      }
      setLoginSubmitting(false);
    }, 600);
  };

  // Handle Admin Logout
  const handleAdminLogout = () => {
    localStorage.removeItem('gravity_admin_auth');
    localStorage.removeItem('gravity_admin_email');
    setIsAuthenticated(false);
    setAdminPassword('');
    showToast('Administrator session ended', 'info');
  };

  // Process data from Firebase/Mock
  const customersList: Customer[] = rawCustomers
    ? Object.entries(rawCustomers).map(([key, val]: [string, any]) => ({
        id: key,
        ...val
      }))
    : [];

  const circuitsList: Circuit[] = rawCircuits
    ? Object.entries(rawCircuits).map(([key, val]: [string, any]) => ({
        id: key,
        ...val
      }))
    : [];

  // Metrics calculation
  const totalCustomers = customersList.length;
  const pendingCount = customersList.filter(c => c.status === 'pending').length;
  const approvedCount = customersList.filter(c => c.status === 'approved').length;
  const totalCircuits = circuitsList.length;
  const unassignedCircuits = circuitsList.filter(c => !c.assignedCustomerId || c.status === 'unassigned').length;

  // Filtered customer list
  const filteredCustomers = customersList.filter(customer => {
    const matchesFilter = statusFilter === 'all' || customer.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      !q ||
      customer.name.toLowerCase().includes(q) ||
      customer.email.toLowerCase().includes(q) ||
      customer.contactPerson.toLowerCase().includes(q) ||
      customer.id.toLowerCase().includes(q) ||
      customer.location.toLowerCase().includes(q);
    return matchesFilter && matchesQuery;
  });

  // Filtered circuit list
  const filteredCircuits = circuitsList.filter(circuit => {
    const q = searchQuery.toLowerCase();
    return (
      !q ||
      circuit.circuitId.toLowerCase().includes(q) ||
      circuit.id.toLowerCase().includes(q) ||
      circuit.name.toLowerCase().includes(q) ||
      (circuit.assignedCustomerName && circuit.assignedCustomerName.toLowerCase().includes(q))
    );
  });

  // Handle Approve Customer
  const handleApproveCustomer = async (customer: Customer) => {
    const res = await updateData(`customers/${customer.id}`, {
      status: 'approved',
      approvedAt: new Date().toISOString()
    });

    if (res.success) {
      showToast(`Approved account for "${customer.name}"`, 'success');
      if (selectedCustomer?.id === customer.id) {
        setSelectedCustomer({ ...selectedCustomer, status: 'approved' });
      }
    } else {
      showToast(`Failed to approve account: ${res.error}`, 'error');
    }
  };

  // Handle Reject Customer
  const handleConfirmReject = async () => {
    if (!rejectingCustomerId) return;
    const targetCustomer = customersList.find(c => c.id === rejectingCustomerId);
    
    const res = await updateData(`customers/${rejectingCustomerId}`, {
      status: 'rejected',
      rejectedAt: new Date().toISOString(),
      rejectionReason: rejectionReasonInput || 'Account application rejected by administrator.'
    });

    if (res.success) {
      showToast(`Rejected account application for "${targetCustomer?.name || 'Customer'}"`, 'info');
      if (selectedCustomer?.id === rejectingCustomerId) {
        setSelectedCustomer({
          ...selectedCustomer,
          status: 'rejected',
          rejectionReason: rejectionReasonInput || 'Account application rejected by administrator.'
        });
      }
      setRejectingCustomerId(null);
      setRejectionReasonInput('');
    } else {
      showToast(`Failed to reject account: ${res.error}`, 'error');
    }
  };

  // Handle Connect Circuit ID to Customer
  const handleConnectCircuit = async (circuitKey: string, targetCustomerId: string) => {
    const targetCustomer = customersList.find(c => c.id === targetCustomerId);
    if (!targetCustomer) return;

    const circuit = circuitsList.find(c => c.id === circuitKey || c.circuitId === circuitKey);
    if (!circuit) return;

    // 1. Update circuit node
    await updateData(`circuits/${circuit.id}`, {
      assignedCustomerId: targetCustomer.id,
      assignedCustomerName: targetCustomer.name,
      status: 'online'
    });

    // 2. Update customer node circuits array
    const existingCircuits = targetCustomer.circuits || [];
    if (!existingCircuits.includes(circuit.id)) {
      await updateData(`customers/${targetCustomer.id}`, {
        circuits: [...existingCircuits, circuit.id]
      });
    }

    showToast(`Connected Circuit "${circuit.circuitId}" to ${targetCustomer.name}`, 'success');
  };

  // Handle Unlink Circuit from Customer
  const handleUnlinkCircuit = async (circuit: Circuit) => {
    if (!circuit.assignedCustomerId) return;

    const previousCustId = circuit.assignedCustomerId;
    const prevCust = customersList.find(c => c.id === previousCustId);

    // 1. Update circuit node
    await updateData(`circuits/${circuit.id}`, {
      assignedCustomerId: null,
      assignedCustomerName: null,
      status: 'unassigned'
    });

    // 2. Update customer node circuits array
    if (prevCust && prevCust.circuits) {
      const updatedCircuits = prevCust.circuits.filter(id => id !== circuit.id && id !== circuit.circuitId);
      await updateData(`customers/${prevCust.id}`, {
        circuits: updatedCircuits
      });
    }

    showToast(`Unlinked Circuit "${circuit.circuitId}"`, 'info');
  };

  // Handle Registering & Connecting New Unique Circuit ID
  const handleCreateAndAssignCircuit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCircuitId.trim()) {
      showToast('Please enter a valid Circuit ID', 'error');
      return;
    }

    const cleanCircuitId = newCircuitId.trim().toUpperCase();
    const existing = circuitsList.find(c => c.circuitId.toLowerCase() === cleanCircuitId.toLowerCase() || c.id.toLowerCase() === cleanCircuitId.toLowerCase());
    if (existing) {
      showToast(`Circuit ID "${cleanCircuitId}" already exists in the system`, 'error');
      return;
    }

    const targetCustomer = customersList.find(c => c.id === newCircuitCustomerTarget);

    const circuitPayload: Circuit = {
      id: cleanCircuitId,
      circuitId: cleanCircuitId,
      name: newCircuitName.trim() || `Circuit Node ${cleanCircuitId}`,
      model: newCircuitModel,
      assignedCustomerId: targetCustomer ? targetCustomer.id : null,
      assignedCustomerName: targetCustomer ? targetCustomer.name : null,
      status: targetCustomer ? 'online' : 'unassigned',
      location: newCircuitLocation || 'Unspecified Location',
      registeredAt: new Date().toISOString()
    };

    // Save circuit to database
    const res = await writeData(`circuits/${cleanCircuitId}`, circuitPayload);

    if (res.success) {
      // If customer target selected, attach circuit to customer
      if (targetCustomer) {
        const existingCircuits = targetCustomer.circuits || [];
        await updateData(`customers/${targetCustomer.id}`, {
          circuits: [...existingCircuits, cleanCircuitId]
        });
        showToast(`Created Circuit ${cleanCircuitId} and connected to ${targetCustomer.name}`, 'success');
      } else {
        showToast(`Created unassigned Circuit ${cleanCircuitId}`, 'success');
      }

      // Reset form
      setNewCircuitId('');
      setNewCircuitName('');
      setNewCircuitCustomerTarget('');
      setShowAddCircuitModal(false);
    } else {
      showToast(`Failed to register circuit: ${res.error}`, 'error');
    }
  };

  // Render Loading Spinner while checking session
  if (authChecking) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <RefreshCw className="w-8 h-8 animate-spin text-emerald-400" />
      </div>
    );
  }

  // RENDER ADMIN LOGIN SCREEN IF NOT AUTHENTICATED
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex items-center justify-center p-6 relative overflow-hidden selection:bg-emerald-500 selection:text-slate-950">
        
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
        <div className="absolute bottom-1/4 right-1/3 w-[450px] h-[450px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

        <div className="max-w-md w-full space-y-6">
          
          {/* Brand Header */}
          <div className="text-center space-y-3">
            <Link href="/" className="inline-flex items-center space-x-3 group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-xl shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Sprout className="w-7 h-7 text-slate-950" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white via-slate-100 to-emerald-400 bg-clip-text text-transparent">
                Gravity Control
              </span>
            </Link>

            <div>
              <h1 className="text-xl font-bold text-white flex items-center justify-center gap-2">
                <Lock className="w-5 h-5 text-emerald-400" />
                <span>Administrator Login</span>
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Enter your administrative credentials to manage customer accounts and hardware circuits.
              </p>
            </div>
          </div>

          {/* Login Card */}
          <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-xl shadow-2xl space-y-5 relative">
            
            {authError && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start space-x-2.5 animate-in fade-in">
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-4">
              
              {/* Email Input */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Admin Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="admin@gravity.io"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loginSubmitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs hover:brightness-110 shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {loginSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="w-4 h-4" />
                    <span>Sign In to Admin Portal</span>
                  </>
                )}
              </button>
            </form>

            {/* Demo Credentials Helper Box */}
            <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs text-emerald-400 space-y-1">
              <div className="font-semibold text-emerald-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Demo Admin Credentials:</span>
              </div>
              <div className="font-mono text-[11px] text-slate-300">
                Email: <span className="text-white font-bold">admin@gravity.io</span>
              </div>
              <div className="font-mono text-[11px] text-slate-300">
                Password: <span className="text-white font-bold">admin123</span>
              </div>
            </div>

          </div>

          <div className="text-center">
            <Link href="/" className="text-xs text-slate-500 hover:text-emerald-400 transition-colors">
              ← Back to Main Homepage
            </Link>
          </div>

        </div>
      </div>
    );
  }

  // RENDER FULL AUTHENTICATED ADMIN PANEL
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 relative overflow-x-hidden">
      {/* Dynamic Background Glow Filters */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-10 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Header Bar */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3 min-w-0">
            <Link href="/" className="flex items-center space-x-2 group shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Sprout className="w-6 h-6 text-slate-950" />
              </div>
            </Link>
            <div className="h-6 w-px bg-white/10 mx-1 shrink-0" />
            <div className="flex items-center space-x-2 min-w-0">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <span className="text-base sm:text-lg font-bold bg-gradient-to-r from-white via-slate-100 to-emerald-400 bg-clip-text text-transparent truncate">
                Gravity Control Admin
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-md uppercase shrink-0">
                Enterprise Admin
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-white/5">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{authenticatedUserEmail}</span>
            </div>

            <Link
              href="/dashboard"
              className="px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white hover:border-emerald-500/40 transition-all flex items-center space-x-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sensor Dashboard</span>
            </Link>

            <button
              onClick={handleAdminLogout}
              className="px-3 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs font-semibold text-rose-300 hover:bg-rose-500 hover:text-white transition-all flex items-center space-x-1.5 cursor-pointer"
              title="Logout Administrator"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile Menu Hamburger Button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-200 hover:text-emerald-400 focus:outline-none"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-950/95 border-b border-white/10 px-4 py-4 space-y-3 animate-in slide-in-from-top-4">
            <div className="flex items-center space-x-2 text-xs text-slate-400 bg-slate-900 p-3 rounded-xl border border-white/5">
              <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="truncate">{authenticatedUserEmail}</span>
            </div>

            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white flex items-center justify-center space-x-2"
            >
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>Sensor Dashboard</span>
            </Link>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleAdminLogout();
              }}
              className="w-full px-4 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs font-semibold text-rose-300 hover:bg-rose-500 hover:text-white flex items-center justify-center space-x-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
        
        {/* Page Title & Quick Add Action */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span>Account Review & Circuit Management</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Review incoming customer applications, approve or reject access, and map unique hardware Circuit IDs to accounts.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddCircuitModal(true)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-semibold text-xs sm:text-sm hover:brightness-110 shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Enter New Circuit ID</span>
            </button>
          </div>
        </div>

        {/* KPI Metrics Dashboard Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          
          {/* Metric 1: Total Customers */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-white/5 backdrop-blur-sm relative overflow-hidden group hover:border-white/10 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-medium text-slate-400 uppercase tracking-wider">Total Accounts</span>
              <div className="p-1.5 sm:p-2 rounded-xl bg-slate-800 text-slate-300">
                <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white mt-2">{totalCustomers}</div>
            <div className="text-[10px] sm:text-[11px] text-slate-500 mt-1 truncate">Registered clients</div>
          </div>

          {/* Metric 2: Pending Approvals */}
          <div className={`p-4 sm:p-5 rounded-2xl border backdrop-blur-sm relative overflow-hidden transition-all ${
            pendingCount > 0
              ? 'bg-amber-500/5 border-amber-500/30 shadow-lg shadow-amber-500/5'
              : 'bg-slate-900/60 border-white/5'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-medium text-amber-400 uppercase tracking-wider">Pending</span>
              <div className="p-1.5 sm:p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-pulse" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-amber-300 mt-2">{pendingCount}</div>
            <div className="text-[10px] sm:text-[11px] text-amber-400/80 mt-1 truncate">Needs review</div>
          </div>

          {/* Metric 3: Approved */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-white/5 backdrop-blur-sm relative overflow-hidden group hover:border-emerald-500/20 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-medium text-emerald-400 uppercase tracking-wider">Approved</span>
              <div className="p-1.5 sm:p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white mt-2">{approvedCount}</div>
            <div className="text-[10px] sm:text-[11px] text-emerald-400/80 mt-1 truncate">Active accounts</div>
          </div>

          {/* Metric 4: Total Circuits */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-white/5 backdrop-blur-sm relative overflow-hidden group hover:border-cyan-500/20 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-medium text-cyan-400 uppercase tracking-wider">Circuits</span>
              <div className="p-1.5 sm:p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                <Cpu className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white mt-2">{totalCircuits}</div>
            <div className="text-[10px] sm:text-[11px] text-cyan-400/80 mt-1 truncate">Hardware units</div>
          </div>

          {/* Metric 5: Unassigned Circuits */}
          <div className="col-span-2 sm:col-span-1 p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-white/5 backdrop-blur-sm relative overflow-hidden group hover:border-purple-500/20 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-medium text-purple-400 uppercase tracking-wider">Unassigned</span>
              <div className="p-1.5 sm:p-2 rounded-xl bg-purple-500/10 text-purple-400">
                <Unlink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white mt-2">{unassignedCircuits}</div>
            <div className="text-[10px] sm:text-[11px] text-purple-400/80 mt-1 truncate">Ready to link</div>
          </div>

        </div>

        {/* Tab Selector & Search Navigation */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex flex-col sm:flex-row gap-2 bg-slate-900/80 p-1 rounded-xl border border-white/5 w-full md:w-auto">
            <button
              onClick={() => setActiveTab('customers')}
              className={`w-full sm:w-auto px-4 sm:px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                activeTab === 'customers'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Customer Account Reviews</span>
              {pendingCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-slate-950 text-emerald-400 text-[10px] font-extrabold">
                  {pendingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('circuits')}
              className={`w-full sm:w-auto px-4 sm:px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                activeTab === 'circuits'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>Circuit ID Manager & Mapping</span>
            </button>
          </div>

          {/* Search Input Bar */}
          <div className="relative w-full md:max-w-xs">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder={activeTab === 'customers' ? "Search customer name, email..." : "Search Circuit ID..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-slate-900 border border-white/10 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* TAB 1: CUSTOMER ACCOUNT REVIEWS */}
        {activeTab === 'customers' && (
          <div className="space-y-6">
            
            {/* Filter Tabs for Customer Status */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-400 font-medium mr-2 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" /> Filter:
                </span>
                {(['all', 'pending', 'approved', 'rejected'] as const).map(st => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                      statusFilter === st
                        ? st === 'pending'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : st === 'approved'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : st === 'rejected'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : 'bg-white/10 text-white border border-white/20'
                        : 'bg-slate-900/60 text-slate-400 border border-white/5 hover:text-slate-200'
                    }`}
                  >
                    {st} {st === 'pending' && `(${pendingCount})`}
                  </button>
                ))}
              </div>

              <div className="text-xs text-slate-400">
                Showing <span className="text-white font-semibold">{filteredCustomers.length}</span> customer accounts
              </div>
            </div>

            {/* Customers Table / Cards */}
            {loadingCustomers ? (
              <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center space-y-3">
                <RefreshCw className="w-8 h-8 animate-spin text-emerald-400" />
                <p className="text-sm">Loading customer database...</p>
              </div>
            ) : filteredCustomers.length === 0 ? (
              <div className="p-12 rounded-2xl bg-slate-900/40 border border-white/5 text-center space-y-3">
                <Users className="w-12 h-12 text-slate-600 mx-auto" />
                <h3 className="text-base font-semibold text-slate-300">No customers found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  No account registrations match your current filter or search criteria.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredCustomers.map((customer) => {
                  // Find circuits linked to this customer
                  const connectedCircuitsList = circuitsList.filter(
                    c => c.assignedCustomerId === customer.id || (customer.circuits && customer.circuits.includes(c.id))
                  );

                  return (
                    <div
                      key={customer.id}
                      className="p-6 rounded-2xl bg-slate-900/60 border border-white/5 hover:border-white/10 backdrop-blur-sm transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-6"
                    >
                      {/* Left: Customer Info */}
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center flex-wrap gap-3">
                          <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                            {customer.name}
                          </h3>
                          
                          {/* Status Badge */}
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                            customer.status === 'approved'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : customer.status === 'pending'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 animate-pulse'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}>
                            {customer.status === 'approved' && <CheckCircle2 className="w-3.5 h-3.5" />}
                            {customer.status === 'pending' && <Clock className="w-3.5 h-3.5" />}
                            {customer.status === 'rejected' && <XCircle className="w-3.5 h-3.5" />}
                            <span>{customer.status}</span>
                          </span>

                          <span className="text-xs text-slate-500 font-mono bg-slate-950 px-2 py-0.5 rounded border border-white/5">
                            ID: {customer.id}
                          </span>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-400">
                          <div className="flex items-center space-x-2">
                            <Mail className="w-3.5 h-3.5 text-slate-500" />
                            <span>{customer.email}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Building className="w-3.5 h-3.5 text-slate-500" />
                            <span>{customer.facilityType || 'Farm Facility'}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-3.5 h-3.5 text-slate-500" />
                            <span>{customer.location || 'Location Unspecified'}</span>
                          </div>
                        </div>

                        {/* Connected Circuits Chips */}
                        <div className="flex items-center flex-wrap gap-2 pt-1">
                          <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                            <Cpu className="w-3.5 h-3.5 text-cyan-400" /> Connected Circuits ({connectedCircuitsList.length}):
                          </span>
                          {connectedCircuitsList.length === 0 ? (
                            <span className="text-[11px] text-slate-500 italic">No circuits assigned yet</span>
                          ) : (
                            connectedCircuitsList.map(crt => (
                              <span
                                key={crt.id}
                                className="px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-mono text-[11px] flex items-center gap-1"
                              >
                                <Radio className="w-3 h-3 text-cyan-400" />
                                {crt.circuitId}
                              </span>
                            ))
                          )}
                        </div>

                        {customer.rejectionReason && (
                          <div className="text-xs text-rose-300 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl flex items-start space-x-2">
                            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-semibold">Rejection Note:</span> {customer.rejectionReason}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2 border-t md:border-t-0 pt-4 md:pt-0 border-white/5">
                        
                        {/* ACCEPT BUTTON */}
                        {customer.status !== 'approved' && (
                          <button
                            onClick={() => handleApproveCustomer(customer)}
                            className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 font-semibold text-xs transition-all flex items-center space-x-1.5 cursor-pointer"
                          >
                            <Check className="w-4 h-4" />
                            <span>Accept Account</span>
                          </button>
                        )}

                        {/* REJECT BUTTON */}
                        {customer.status !== 'rejected' && (
                          <button
                            onClick={() => setRejectingCustomerId(customer.id)}
                            className="px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white font-semibold text-xs transition-all flex items-center space-x-1.5 cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                            <span>Reject</span>
                          </button>
                        )}

                        {/* VIEW & CONNECT DETAILS BUTTON */}
                        <button
                          onClick={() => setSelectedCustomer(customer)}
                          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-white/10 transition-all flex items-center space-x-1 cursor-pointer"
                        >
                          <span>Manage / Link</span>
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        </button>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* TAB 2: CIRCUIT ID MANAGER & MAPPING */}
        {activeTab === 'circuits' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/40 p-4 rounded-2xl border border-white/5">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-cyan-400" />
                  <span>Unique Circuit ID Registry</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Each hardware circuit possesses a unique identifier string. Enter new IDs or manage customer assignments below.
                </p>
              </div>

              <button
                onClick={() => setShowAddCircuitModal(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-bold text-xs hover:brightness-110 shadow-md transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add & Connect Circuit</span>
              </button>
            </div>

            {/* Circuits List Grid */}
            {loadingCircuits ? (
              <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center space-y-3">
                <RefreshCw className="w-8 h-8 animate-spin text-cyan-400" />
                <p className="text-sm">Loading circuit registry...</p>
              </div>
            ) : filteredCircuits.length === 0 ? (
              <div className="p-12 rounded-2xl bg-slate-900/40 border border-white/5 text-center space-y-3">
                <Cpu className="w-12 h-12 text-slate-600 mx-auto" />
                <h3 className="text-base font-semibold text-slate-300">No circuits found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  No circuit IDs match your current search query.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredCircuits.map((circuit) => {
                  const assignedCust = customersList.find(c => c.id === circuit.assignedCustomerId);

                  return (
                    <div
                      key={circuit.id}
                      className="p-5 rounded-2xl bg-slate-900/60 border border-white/5 hover:border-cyan-500/30 backdrop-blur-sm transition-all space-y-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-bold">
                              {circuit.circuitId}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                              circuit.status === 'online'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : circuit.status === 'offline'
                                ? 'bg-slate-800 text-slate-400 border border-white/5'
                                : 'bg-purple-500/10 text-purple-300 border border-purple-500/20'
                            }`}>
                              {circuit.status}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-white pt-1">{circuit.name}</h4>
                          <p className="text-xs text-slate-400">{circuit.model} • {circuit.location}</p>
                        </div>

                        <div className="p-2 rounded-xl bg-slate-800 text-cyan-400">
                          <Radio className="w-4 h-4 animate-pulse" />
                        </div>
                      </div>

                      {/* Connection State Card */}
                      <div className="p-3 rounded-xl bg-slate-950/70 border border-white/5 flex items-center justify-between text-xs">
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-slate-500 uppercase font-semibold">Assigned Customer</span>
                          <div>
                            {assignedCust ? (
                              <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                                <Building className="w-3 h-3 text-emerald-400" />
                                {assignedCust.name}
                              </span>
                            ) : (
                              <span className="text-amber-400/90 font-medium italic">Unassigned (Available)</span>
                            )}
                          </div>
                        </div>

                        {assignedCust ? (
                          <button
                            onClick={() => handleUnlinkCircuit(circuit)}
                            className="px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white transition-all text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <Unlink className="w-3 h-3" />
                            <span>Unlink</span>
                          </button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <select
                              onChange={(e) => {
                                if (e.target.value) {
                                  handleConnectCircuit(circuit.id, e.target.value);
                                }
                              }}
                              defaultValue=""
                              className="bg-slate-900 border border-white/10 rounded-lg text-xs text-slate-200 px-2 py-1 focus:outline-none focus:border-cyan-500"
                            >
                              <option value="" disabled>Connect to Customer...</option>
                              {customersList.map(c => (
                                <option key={c.id} value={c.id}>
                                  {c.name} ({c.status})
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </main>

      {/* MODAL 1: CUSTOMER DETAIL & CIRCUIT LINKING DRAWER */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            
            <button
              onClick={() => setSelectedCustomer(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  selectedCustomer.status === 'approved'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : selectedCustomer.status === 'pending'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}>
                  {selectedCustomer.status}
                </span>
                <span className="text-xs text-slate-500 font-mono">ID: {selectedCustomer.id}</span>
              </div>
              <h2 className="text-xl font-bold text-white">{selectedCustomer.name}</h2>
            </div>

            {/* Profile Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-950/60 border border-white/5 text-xs text-slate-300">
              <div>
                <span className="text-slate-500 block">Contact Person</span>
                <span className="font-semibold text-white">{selectedCustomer.contactPerson}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Email Address</span>
                <span className="font-semibold text-white">{selectedCustomer.email}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Facility Type</span>
                <span className="font-semibold text-white">{selectedCustomer.facilityType || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Location</span>
                <span className="font-semibold text-white">{selectedCustomer.location || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Registration Date</span>
                <span className="font-semibold text-white">{new Date(selectedCustomer.registeredAt).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Phone</span>
                <span className="font-semibold text-white">{selectedCustomer.phone || 'N/A'}</span>
              </div>
            </div>

            {selectedCustomer.notes && (
              <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 text-xs text-slate-300 space-y-1">
                <span className="text-slate-500 font-semibold block">Application Notes</span>
                <p>{selectedCustomer.notes}</p>
              </div>
            )}

            {/* Account Status Decision Buttons */}
            <div className="p-4 rounded-xl bg-slate-950/40 border border-white/5 space-y-3">
              <span className="text-xs font-semibold text-slate-400 block">Account Status Action</span>
              <div className="flex items-center gap-3">
                {selectedCustomer.status !== 'approved' && (
                  <button
                    onClick={() => handleApproveCustomer(selectedCustomer)}
                    className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:brightness-110 transition-all flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Approve Account Access</span>
                  </button>
                )}
                {selectedCustomer.status !== 'rejected' && (
                  <button
                    onClick={() => {
                      setRejectingCustomerId(selectedCustomer.id);
                    }}
                    className="px-4 py-2 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 font-bold text-xs hover:bg-rose-500 hover:text-white transition-all flex items-center space-x-1.5 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                    <span>Reject Application</span>
                  </button>
                )}
              </div>
            </div>

            {/* Connected Circuits Management for this Customer */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-cyan-400" />
                  <span>Connected Circuits</span>
                </h3>
              </div>

              {circuitsList.filter(c => c.assignedCustomerId === selectedCustomer.id).length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-950/50 border border-white/5 text-center text-xs text-slate-500">
                  No Circuit IDs currently connected to this account.
                </div>
              ) : (
                <div className="space-y-2">
                  {circuitsList.filter(c => c.assignedCustomerId === selectedCustomer.id).map(crt => (
                    <div
                      key={crt.id}
                      className="p-3 rounded-xl bg-slate-950/80 border border-white/5 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="px-2 py-1 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono font-bold">
                          {crt.circuitId}
                        </span>
                        <div>
                          <div className="font-semibold text-white">{crt.name}</div>
                          <div className="text-[11px] text-slate-500">{crt.location}</div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleUnlinkCircuit(crt)}
                        className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
                        title="Unlink circuit"
                      >
                        <Unlink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Quick Link Unassigned Circuit Dropdown */}
              <div className="pt-2">
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">
                  Link Available Circuit to {selectedCustomer.name}:
                </label>
                <div className="flex gap-2">
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        handleConnectCircuit(e.target.value, selectedCustomer.id);
                        e.target.value = '';
                      }
                    }}
                    defaultValue=""
                    className="flex-1 bg-slate-950 border border-white/10 rounded-xl text-xs text-slate-200 px-3 py-2.5 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="" disabled>Select unassigned Circuit ID...</option>
                    {circuitsList.filter(c => !c.assignedCustomerId || c.status === 'unassigned').map(c => (
                      <option key={c.id} value={c.id}>
                        {c.circuitId} — {c.name} ({c.location})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 2: REJECT REASON PROMPT */}
      {rejectingCustomerId && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <XCircle className="w-5 h-5 text-rose-400" />
              <span>Reject Customer Application</span>
            </h3>
            <p className="text-xs text-slate-400">
              Please state the reason for rejecting this customer account application (optional):
            </p>
            <textarea
              rows={3}
              value={rejectionReasonInput}
              onChange={(e) => setRejectionReasonInput(e.target.value)}
              placeholder="e.g. Incomplete business verification documents or invalid contact parameters."
              className="w-full p-3 bg-slate-950 border border-white/10 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500"
            />
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setRejectingCustomerId(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs hover:bg-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 rounded-xl bg-rose-500 text-white font-bold text-xs hover:bg-rose-600 transition-all cursor-pointer"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: ENTER NEW CIRCUIT ID FORM */}
      {showAddCircuitModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 space-y-5 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setShowAddCircuitModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Register & Connect Unique Circuit ID</span>
              </h3>
              <p className="text-xs text-slate-400">
                Input the hardware unique Circuit ID and optionally connect it to a customer account.
              </p>
            </div>

            <form onSubmit={handleCreateAndAssignCircuit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Unique Circuit ID <span className="text-emerald-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CRCT-8899-X or lionbit/device02"
                  value={newCircuitId}
                  onChange={(e) => setNewCircuitId(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-white/10 rounded-xl text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Circuit Name / Label
                </label>
                <input
                  type="text"
                  placeholder="e.g. Reservoir Sensor Array Bay 4"
                  value={newCircuitName}
                  onChange={(e) => setNewCircuitName(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-white/10 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Hardware Model</label>
                  <input
                    type="text"
                    value={newCircuitModel}
                    onChange={(e) => setNewCircuitModel(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Location / Zone</label>
                  <input
                    type="text"
                    value={newCircuitLocation}
                    onChange={(e) => setNewCircuitLocation(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Connect Immediately To Customer (Optional)
                </label>
                <select
                  value={newCircuitCustomerTarget}
                  onChange={(e) => setNewCircuitCustomerTarget(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-white/10 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="">Leave Unassigned (Inventory)</option>
                  {customersList.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.status})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddCircuitModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs hover:brightness-110 shadow-lg cursor-pointer"
                >
                  Register & Bind Circuit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION FLOATER */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in">
          <div className={`px-4 py-3 rounded-xl border text-xs font-semibold shadow-2xl flex items-center space-x-2.5 ${
            toastMessage.type === 'success'
              ? 'bg-emerald-950 border-emerald-500/40 text-emerald-200'
              : toastMessage.type === 'info'
              ? 'bg-slate-900 border-white/20 text-slate-100'
              : 'bg-rose-950 border-rose-500/40 text-rose-200'
          }`}>
            {toastMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            {toastMessage.type === 'info' && <Sparkles className="w-4 h-4 text-cyan-400" />}
            {toastMessage.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400" />}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

    </div>
  );
}
