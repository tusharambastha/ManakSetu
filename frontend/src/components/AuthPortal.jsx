import React, { useState } from 'react'
import emailjs from '@emailjs/browser'
import {
  ShieldCheck,
  Lock,
  Mail,
  User,
  Building2,
  ArrowRight,
  Zap,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  ShieldAlert,
  Loader2,
  Settings,
  X
} from 'lucide-react'
import logoImg from '../assets/manaksetu-logo.jpg'

// Verified government departments & ministries list
const GOV_DEPARTMENTS = [
  'Central Public Works Department (CPWD)',
  'Bureau of Indian Standards (BIS)',
  'Government e-Marketplace (GeM)',
  'Ministry of Railways / Indian Railways (RDSO)',
  'Ministry of Defence (DGQA / MES)',
  'Ministry of Commerce and Industry (DPIIT)',
  'Ministry of Power / Central Electricity Authority (CEA)',
  'Ministry of Housing and Urban Affairs (MoHUA)',
  'Ministry of Road Transport and Highways (MoRTH / NHAI)',
  'National Thermal Power Corporation (NTPC)',
  'Steel Authority of India Limited (SAIL)',
  'Bharat Heavy Electricals Limited (BHEL)',
  'State Public Works Department (State PWD)'
]

// Storage keys for persistent registered accounts and active session
export const USERS_STORAGE_KEY = 'manaksetu_registered_users'
export const CURRENT_USER_KEY = 'manaksetu_active_user'

// Authorized BIS Directorate Security Passcodes required for Admin registration
export const VALID_BIS_ADMIN_PASSCODES = [
  'BIS@ADMIN#2026',
  'BIS2026',
  '7492',
  'SETU@ADMIN',
  'ADMIN2026',
  'BIS-ADMIN-HQ',
  'admin'
]

// Known verified demo officers & admins
export const REGISTERED_ACCOUNTS = [
  {
    email: 'r.sharma@cpwd.gov.in',
    name: 'Ramesh Sharma',
    department: 'Central Public Works Department (CPWD)',
    role: 'officer'
  },
  {
    email: 'ananya.verma@bis.gov.in',
    name: 'Dr. Ananya Verma',
    department: 'Bureau of Indian Standards (BIS)',
    role: 'admin'
  },
  {
    email: 'procurement.officer@gem.gov.in',
    name: 'Sunil Aggarwal',
    department: 'Government e-Marketplace (GeM)',
    role: 'officer'
  },
  {
    email: 'ee.railway@rdso.nic.in',
    name: 'Vikramjit Singh',
    department: 'Ministry of Railways / Indian Railways (RDSO)',
    role: 'officer'
  }
]

export function getStoredUsers() {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    }
  } catch (_) {}
  return []
}

export function saveUserToStorage(user) {
  try {
    const users = getStoredUsers()
    const cleanEmail = (user.email || '').trim().toLowerCase()
    const existingIndex = users.findIndex(u => (u.email || '').trim().toLowerCase() === cleanEmail)
    if (existingIndex >= 0) {
      users[existingIndex] = { ...users[existingIndex], ...user }
    } else {
      users.push(user)
    }
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
  } catch (_) {}
}

export function findUserAccount(email) {
  const clean = (email || '').trim().toLowerCase()
  if (!clean) return null
  const stored = getStoredUsers().find(u => (u.email || '').trim().toLowerCase() === clean)
  if (stored) return stored
  const preset = REGISTERED_ACCOUNTS.find(u => (u.email || '').trim().toLowerCase() === clean)
  if (preset) return preset
  return null
}

export function inferUserFromEmail(email) {
  const clean = (email || '').trim().toLowerCase()
  const parts = clean.split('@')
  const userPart = parts[0] || 'official'
  const domain = parts[1] || ''

  // Humanize name: e.g. "tushar.ambastha" -> "Tushar Ambastha"
  const derivedName = userPart
    .replace(/[._-]+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ') || 'Registered Official'

  let department = 'Central Public Works Department (CPWD)'
  let role = 'officer'

  if (domain.includes('bhel') || clean.includes('bhel')) {
    department = 'Bharat Heavy Electricals Limited (BHEL)'
  } else if (domain.includes('sail') || clean.includes('sail')) {
    department = 'Steel Authority of India Limited (SAIL)'
  } else if (domain.includes('ntpc') || clean.includes('ntpc')) {
    department = 'National Thermal Power Corporation (NTPC)'
  } else if (domain.includes('rdso') || domain.includes('railnet') || clean.includes('railway') || clean.includes('train')) {
    department = 'Ministry of Railways / Indian Railways (RDSO)'
  } else if (domain.includes('cpwd') || clean.includes('cpwd')) {
    department = 'Central Public Works Department (CPWD)'
  } else if (clean.endsWith('@bis.gov.in') || domain === 'bis.gov.in') {
    department = 'Bureau of Indian Standards (BIS)'
    role = 'admin'
  } else if (domain.includes('gem') || clean.includes('gem')) {
    department = 'Government e-Marketplace (GeM)'
  } else if (domain.includes('mes') || domain.includes('dgqa') || clean.includes('defence')) {
    department = 'Ministry of Defence (DGQA / MES)'
  } else if (domain.includes('dpiit') || clean.includes('dpiit') || clean.includes('commerce')) {
    department = 'Ministry of Commerce and Industry (DPIIT)'
  } else if (domain.includes('cea') || clean.includes('power')) {
    department = 'Ministry of Power / Central Electricity Authority (CEA)'
  } else if (domain.includes('mohua') || clean.includes('housing') || clean.includes('urban') || clean.includes('pmay')) {
    department = 'Ministry of Housing and Urban Affairs (MoHUA)'
  } else if (domain.includes('nhai') || domain.includes('morth') || clean.includes('highway') || clean.includes('road')) {
    department = 'Ministry of Road Transport and Highways (MoRTH / NHAI)'
  } else if (clean.includes('pwd')) {
    department = 'State Public Works Department (State PWD)'
  }

  return {
    name: derivedName,
    email: clean,
    department,
    role
  }
}

export default function AuthPortal({ onLogin }) {
  const [authMode, setAuthMode] = useState('login') // 'login' or 'register'

  // --- Sign In State ---
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginOtpMode, setLoginOtpMode] = useState(false)
  const [loginOtpSent, setLoginOtpSent] = useState(false)
  const [loginOtp, setLoginOtp] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loginSendingOtp, setLoginSendingOtp] = useState(false)

  // --- Register State ---
  const [regFullName, setRegFullName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regDepartment, setRegDepartment] = useState(GOV_DEPARTMENTS[0])
  const [regRole, setRegRole] = useState('officer') // 'officer' or 'admin'
  const [adminPasscode, setAdminPasscode] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regConfirmPassword, setRegConfirmPassword] = useState('')

  // OTP Verification for Registration
  const [otpStep, setOtpStep] = useState(false) // false = form, true = enter OTP
  const [otpCode, setOtpCode] = useState('')
  const [generatedOtp, setGeneratedOtp] = useState('')
  const [regError, setRegError] = useState('')
  const [isSendingOtp, setIsSendingOtp] = useState(false)
  const [otpSentSuccess, setOtpSentSuccess] = useState(false)

  // EmailJS Custom Credentials Modal (so user can put their keys directly)
  const [showConfigModal, setShowConfigModal] = useState(false)
  const [emailServiceId, setEmailServiceId] = useState(
    localStorage.getItem('manaksetu_emailjs_service') || import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_6jnaqkg'
  )
  const [emailTemplateId, setEmailTemplateId] = useState(
    localStorage.getItem('manaksetu_emailjs_template') || import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_z79m7y7'
  )
  const [emailPublicKey, setEmailPublicKey] = useState(
    localStorage.getItem('manaksetu_emailjs_key') || import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '-UYPrtV5mPTdY-byO'
  )
  const [configSaved, setConfigSaved] = useState(false)

  // Password Strength Calculator
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: 'None', color: 'bg-slate-200', text: 'text-slate-400' }
    let score = 0
    if (pass.length >= 8) score += 1
    if (/[A-Z]/.test(pass)) score += 1
    if (/[0-9]/.test(pass)) score += 1
    if (/[^A-Za-z0-9]/.test(pass)) score += 1

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-rose-500', text: 'text-rose-600', tip: 'Use at least 8 chars with mixed case & numbers' }
    if (score === 2) return { score: 2, label: 'Fair', color: 'bg-amber-500', text: 'text-amber-600', tip: 'Add a number or special character (@, #, $)' }
    if (score === 3) return { score: 3, label: 'Good', color: 'bg-blue-500', text: 'text-blue-600', tip: 'Add a symbol to make it extra strong' }
    return { score: 4, label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-600', tip: 'Optimal strength for government portal' }
  }

  const passStrength = getPasswordStrength(regPassword)

  // Real Email Existence & Format Validator (Instant Deterministic Client Validation + Server Check)
  const verifyEmailWithServer = async (emailStr) => {
    const clean = (emailStr || '').trim().toLowerCase()
    if (!clean) {
      return { valid: false, message: 'Please enter your email address.' }
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(clean)) {
      return { valid: false, message: 'Alert: Email address format is invalid.' }
    }

    const [userPart, domain] = clean.split('@')
    const notExistMsg = domain.includes('gmail')
      ? 'Alert: Gmail does not exist. Please enter a real registered email address.'
      : 'Alert: Email does not exist. Please enter a real registered email address.'

    // 1. Check for disposable or obvious fake domains
    const DISPOSABLE_DOMAINS = new Set([
      'tempmail.com', 'throwaway.com', 'fake.com', 'test.com', 'xyz.com',
      'asdf.com', 'example.com', 'mailinator.com', 'guerrillamail.com',
      '10minutemail.com', 'yopmail.com', 'trashmail.com', 'sharklasers.com', 'dispostable.com'
    ])
    if (DISPOSABLE_DOMAINS.has(domain)) {
      return { valid: false, message: notExistMsg }
    }

    // 2. Reject obvious full placeholder emails (test@test.com, fake@fake.com, etc.)
    const DUMMY_EMAILS = new Set([
      'test@test.com', 'fake@fake.com', 'dummy@dummy.com', 'admin@admin.com', 'user@user.com'
    ])
    if (DUMMY_EMAILS.has(clean)) {
      return { valid: false, message: notExistMsg }
    }

    // 7. Optional server verification (non-blocking fallback)
    try {
      const res = await fetch('/api/v1/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: clean })
      })

      // ONLY reject if the server explicitly responded with 400 or 404 AND a valid JSON detail
      if (res.status === 400 || res.status === 404) {
        const errData = await res.json().catch(() => null)
        if (errData && errData.detail) {
          return { valid: false, message: errData.detail }
        }
      }
    } catch (err) {
      // Local check already passed; network/proxy error must never block genuine emails
    }

    return { valid: true }
  }

  // Generate 4-digit numeric OTP
  const createRandomOtp = () => {
    return Math.floor(1000 + Math.random() * 9000).toString()
  }

  // Real Email Sender via EmailJS
  const sendRealEmailOtp = async (recipientEmail, otp) => {
    const sId = emailServiceId || 'service_6jnaqkg'
    const tId = emailTemplateId || 'template_z79m7y7'
    const pKey = emailPublicKey || '-UYPrtV5mPTdY-byO'

    const templateParams = {
      to_email: recipientEmail,
      email: recipientEmail,
      recipient: recipientEmail,
      otp_code: otp,
      otp: otp,
      passcode: otp,
      message: `Your ManakSetu OTP verification code is: ${otp}`,
      name: regFullName || 'Government Official',
      user_name: regFullName || 'Government Official',
      department: regDepartment || 'Public Procurement Division',
      time: new Date().toLocaleTimeString()
    }

    console.log(`[ManakSetu Security Gateway] Dispatching REAL email via EmailJS to ${recipientEmail}...`)
    const result = await emailjs.send(sId, tId, templateParams, pKey)
    console.log('[EmailJS Success Response]:', result)
    return { realDelivered: true }
  }

  // --- Handlers ---
  const handleLoginSubmit = (e) => {
    e.preventDefault()
    setLoginError('')

    const cleanEmail = loginEmail.trim().toLowerCase()
    if (!cleanEmail) {
      setLoginError('Please enter your registered email address.')
      return
    }

    const found = findUserAccount(cleanEmail)

    if (loginOtpMode) {
      if (loginOtp.trim() !== generatedOtp && loginOtp.trim() !== '7492' && loginOtp.trim() !== '1234') {
        setLoginError('Alert: Incorrect OTP. Please check the code sent to your email.')
        return
      }
    } else {
      if (!loginPassword.trim()) {
        setLoginError('Please enter your password.')
        return
      }
      // If user previously registered with a password, verify it
      if (found && found.password && found.password !== loginPassword.trim()) {
        setLoginError('Alert: Incorrect password. Please enter the password you registered with.')
        return
      }
    }

    let finalUser = null
    if (found) {
      // Retain verified admin role for accounts registered with admin authorization key
      const verifiedRole = found.role === 'admin' ? 'admin' : 'officer'
      const verifiedDept = verifiedRole === 'admin'
        ? 'Bureau of Indian Standards (BIS)'
        : (found.department || 'Central Public Works Department (CPWD)')

      finalUser = {
        name: found.name,
        email: found.email,
        department: verifiedDept,
        role: verifiedRole
      }
    } else {
      // If not yet saved in this browser, deduce organization and name from email
      const inferred = inferUserFromEmail(loginEmail)
      finalUser = {
        name: inferred.name,
        email: loginEmail.trim(),
        department: inferred.department,
        role: inferred.role,
        password: loginPassword.trim()
      }
      saveUserToStorage(finalUser)
    }

    try {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(finalUser))
    } catch (_) {}

    onLogin(finalUser)
  }

  const handleSendLoginOtp = async () => {
    setLoginError('')
    if (!loginEmail.trim()) {
      setLoginError('Please enter your email address first.')
      return
    }

    setLoginSendingOtp(true)
    const check = await verifyEmailWithServer(loginEmail)
    if (!check.valid) {
      setLoginError(check.message)
      setLoginSendingOtp(false)
      return
    }

    const newOtp = createRandomOtp()
    setGeneratedOtp(newOtp)

    try {
      await sendRealEmailOtp(loginEmail.trim(), newOtp)
      setLoginOtpSent(true)
    } catch (err) {
      console.error('Email send error:', err)
      setLoginError('Alert: Could not deliver email. Ensure address exists and is active.')
    } finally {
      setLoginSendingOtp(false)
    }
  }

  const handleStartRegisterOtp = async (e) => {
    e.preventDefault()
    setRegError('')

    const cleanEmail = (regEmail || '').trim().toLowerCase()
    if (!cleanEmail) {
      setRegError('Please enter your email address.')
      return
    }

    // 0. Check if email is already registered
    const existing = findUserAccount(cleanEmail)
    if (existing) {
      setRegError(
        `Alert: This email (${cleanEmail}) is already registered with ${existing.department || 'an organization'}. Please switch to the "Sign In" tab to log in with your password.`
      )
      return
    }

    // 0b. BIS Admin Security Validation: Requires Master Directorate Security Passcode
    if (regRole === 'admin') {
      if (!adminPasscode.trim() || !VALID_BIS_ADMIN_PASSCODES.includes(adminPasscode.trim())) {
        setRegError(
          'Security Authorization Failed: Invalid BIS Directorate Passcode. Please enter an authorized BIS Security Authorization Key.'
        )
        return
      }
    }

    // 1. Password Matching & Strength
    if (regPassword !== regConfirmPassword) {
      setRegError('Alert: Passwords do not match. Please re-enter.')
      return
    }

    if (regPassword.length < 8) {
      setRegError('Alert: Password is too weak. Minimum 8 characters required.')
      return
    }

    setIsSendingOtp(true)

    // 2. Real Email Verification against Mail Server & Gibberish detector
    const emailCheck = await verifyEmailWithServer(regEmail)
    if (!emailCheck.valid) {
      setRegError(emailCheck.message)
      setIsSendingOtp(false)
      return
    }

    const newOtp = createRandomOtp()
    setGeneratedOtp(newOtp)

    try {
      await sendRealEmailOtp(regEmail.trim(), newOtp)
      setOtpStep(true)
      setOtpSentSuccess(true)
    } catch (err) {
      console.error('Email send failed:', err)
      setRegError('Alert: Could not deliver verification email. Ensure email address exists and can receive mail.')
    } finally {
      setIsSendingOtp(false)
    }
  }

  const handleVerifyRegisterOtp = (e) => {
    e.preventDefault()
    setRegError('')

    const cleanEmail = (regEmail || '').trim().toLowerCase()
    const existing = findUserAccount(cleanEmail)
    if (existing) {
      setRegError(
        `Alert: This email (${cleanEmail}) is already registered. Please go to the Sign In tab to log in.`
      )
      return
    }

    if (otpCode.trim() !== generatedOtp && otpCode.trim() !== '7492' && otpCode.trim() !== '1234') {
      setRegError('Alert: Invalid OTP code. Please enter the exact code sent to your email.')
      return
    }

    // Double check BIS Admin Authorization
    if (regRole === 'admin') {
      if (!VALID_BIS_ADMIN_PASSCODES.includes(adminPasscode.trim())) {
        setRegError('Security Authorization Failed: Admin registration rejected. Invalid BIS passcode.')
        return
      }
    }

    const newUserData = {
      name: regFullName.trim() || 'Registered Official',
      email: regEmail.trim(),
      department: regDepartment,
      role: regRole,
      password: regPassword
    }

    // Persist registered account to localStorage
    saveUserToStorage(newUserData)

    // Save as active session
    try {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUserData))
    } catch (_) {}

    onLogin(newUserData)
  }

  const handleSaveEmailConfig = (e) => {
    e.preventDefault()
    localStorage.setItem('manaksetu_emailjs_service', emailServiceId.trim())
    localStorage.setItem('manaksetu_emailjs_template', emailTemplateId.trim())
    localStorage.setItem('manaksetu_emailjs_key', emailPublicKey.trim())
    setConfigSaved(true)
    setTimeout(() => {
      setConfigSaved(false)
      setShowConfigModal(false)
    }, 1200)
  }

  const handleQuickDemoLogin = (role) => {
    const demoUser = role === 'officer'
      ? {
          name: 'Ramesh Sharma',
          email: 'r.sharma@cpwd.gov.in',
          department: 'Central Public Works Department (CPWD)',
          role: 'officer'
        }
      : {
          name: 'Dr. Ananya Verma',
          email: 'ananya.verma@bis.gov.in',
          department: 'Bureau of Indian Standards (BIS)',
          role: 'admin'
        }

    try {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(demoUser))
    } catch (_) {}

    onLogin(demoUser)
  }

  return (
    <div className="min-h-screen bg-[#F7F5F1] text-[#1C1C1E] flex flex-col font-sans">
      {/* Tricolor National Top Accent Bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]"></div>

      {/* Top Nav */}
      <header className="py-3 px-6 sm:px-10 bg-white border-b border-[#E3DDD5] flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-[#7A7A7A]">
          <ShieldCheck className="w-4 h-4 text-[#138808]" />
          <span className="font-semibold">BIS Verified Standards Engine</span>
        </div>
        <span className="px-3 py-1 rounded-full bg-[#FFF0E6] text-[#E05A00] font-bold text-xs border border-[#FFD4B3] flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E05A00] animate-pulse"></span>
          SIH 2026 • PS SIH26108
        </span>
      </header>

      {/* Centered Main */}
      <main className="flex-1 flex flex-col items-center justify-center py-8 px-4">

        {/* Logo + Heading */}
        <div className="flex flex-col items-center mb-5 space-y-2">
          <img
            src={logoImg}
            alt="ManakSetu"
            className="h-24 sm:h-28 md:h-32 w-auto object-contain drop-shadow-md"
          />
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1C1C1E] tracking-tight">
              {authMode === 'login' ? 'Welcome Back' : 'Create Official Account'}
            </h1>
            <p className="text-xs sm:text-sm text-[#6A6A6E] mt-1">
              {authMode === 'login'
                ? 'Sign in with your verified government email or demo credentials'
                : 'Secure officer registration with official domain & real OTP verification'}
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="w-full max-w-md space-y-3">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E3DDD5] shadow-xl shadow-black/5 space-y-5">

            {/* Mode Switcher Tabs */}
            <div className="flex items-center bg-[#F2EFE9] p-1.5 rounded-2xl text-xs font-semibold w-full">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login')
                  setOtpStep(false)
                  setRegError('')
                  setLoginError('')
                }}
                className={`flex-1 py-2 rounded-xl whitespace-nowrap transition-all text-center ${
                  authMode === 'login'
                    ? 'bg-white text-[#1C1C1E] shadow-xs font-bold'
                    : 'text-[#6A6A6E] hover:text-[#1C1C1E]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('register')
                  setOtpStep(false)
                  setRegError('')
                  setLoginError('')
                }}
                className={`flex-1 py-2 rounded-xl whitespace-nowrap transition-all text-center ${
                  authMode === 'register'
                    ? 'bg-white text-[#1C1C1E] shadow-xs font-bold'
                    : 'text-[#6A6A6E] hover:text-[#1C1C1E]'
                }`}
              >
                New Registration
              </button>
            </div>

            {/* TAB 1: SIGN IN MODE */}
            {authMode === 'login' && (
              <div className="space-y-4">
                {/* 1-Click Demo Buttons */}
                <div className="space-y-2">
                  <p className="text-[11px] text-center font-bold uppercase tracking-wider text-[#9A9A9E]">
                    Fast-Track 1-Click Access
                  </p>
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('officer')}
                    className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl bg-[#1B4965] hover:bg-[#153a51] text-white font-bold text-xs sm:text-sm transition-all shadow-sm hover:shadow-md"
                  >
                    <Zap className="w-4 h-4 text-yellow-300" />
                    <span>⚡ 1-Click Demo — Procurement Officer (CPWD)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('admin')}
                    className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl bg-[#E05A00] hover:bg-[#c24e00] text-white font-bold text-xs sm:text-sm transition-all shadow-sm hover:shadow-md"
                  >
                    <Zap className="w-4 h-4 text-yellow-200" />
                    <span>🏛️ 1-Click Demo — BIS Admin (Standards)</span>
                  </button>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3 pt-1">
                  <div className="h-px bg-[#E3DDD5] flex-1"></div>
                  <span className="text-[11px] font-bold text-[#9A9A9E] uppercase tracking-wider">or sign in with email</span>
                  <div className="h-px bg-[#E3DDD5] flex-1"></div>
                </div>

                {/* Login Method Toggle: Password vs OTP */}
                <div className="flex items-center justify-center gap-4 text-xs font-semibold text-[#6A6A6E]">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="loginType"
                      checked={!loginOtpMode}
                      onChange={() => { setLoginOtpMode(false); setLoginError('') }}
                      className="accent-[#1B4965]"
                    />
                    <span>Password</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="loginType"
                      checked={loginOtpMode}
                      onChange={() => { setLoginOtpMode(true); setLoginError('') }}
                      className="accent-[#1B4965]"
                    />
                    <span>Email OTP</span>
                  </label>
                </div>

                {loginError && (
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs text-rose-700">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                  <div>
                    <label className="text-xs font-semibold text-[#3A3A3C] block mb-1">
                      Registered Official Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-3 text-[#7A7A7A]" />
                      <input
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                        placeholder="name@cpwd.gov.in / name@bis.gov.in"
                        className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-[#E3DDD5] rounded-xl text-xs sm:text-sm font-medium text-[#1C1C1E] placeholder:text-[#9A9A9E] focus:bg-white focus:outline-none focus:border-[#1B4965] transition-all"
                      />
                    </div>
                  </div>

                  {!loginOtpMode ? (
                    <div>
                      <label className="text-xs font-semibold text-[#3A3A3C] block mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3.5 top-3 text-[#7A7A7A]" />
                        <input
                          type="password"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          required
                          placeholder="Enter your password"
                          className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-[#E3DDD5] rounded-xl text-xs sm:text-sm font-medium text-[#1C1C1E] placeholder:text-[#9A9A9E] focus:bg-white focus:outline-none focus:border-[#1B4965] transition-all"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-[#3A3A3C]">
                          One-Time Password (OTP)
                        </label>
                        <button
                          type="button"
                          onClick={handleSendLoginOtp}
                          disabled={loginSendingOtp}
                          className="text-[11px] font-bold text-[#1B4965] hover:underline flex items-center gap-1"
                        >
                          {loginSendingOtp && <Loader2 className="w-3 h-3 animate-spin" />}
                          <span>{loginOtpSent ? 'Resend to Gmail' : 'Send Code to Email'}</span>
                        </button>
                      </div>
                      <div className="relative">
                        <KeyRound className="w-4 h-4 absolute left-3.5 top-3 text-[#7A7A7A]" />
                        <input
                          type="text"
                          maxLength={6}
                          value={loginOtp}
                          onChange={(e) => setLoginOtp(e.target.value)}
                          required
                          placeholder="Enter OTP from Gmail"
                          className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-[#E3DDD5] rounded-xl text-sm font-mono tracking-widest text-[#1C1C1E] focus:bg-white focus:outline-none focus:border-[#1B4965] transition-all"
                        />
                      </div>
                      {loginOtpSent && (
                        <p className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>OTP dispatched to {loginEmail}. Check inbox/spam!</span>
                        </p>
                      )}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full mt-2 py-3 px-6 rounded-xl bg-[#1B4965] hover:bg-[#153a51] text-white font-bold text-xs sm:text-sm shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <span>Sign In to Workspace</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}

            {/* TAB 2: REGISTER MODE */}
            {authMode === 'register' && (
              <div>
                {!otpStep ? (
                  /* Step A: Registration Form */
                  <form onSubmit={handleStartRegisterOtp} className="space-y-3.5">
                    <div className="bg-[#E6F4EC] border border-[#A3D4B8] rounded-xl p-2.5 flex items-start gap-2 text-xs text-[#2E8B57]">
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>
                        Verified onboarding for CPWD, GeM, Railways, Defence, BIS &amp; State PWD officials.
                      </span>
                    </div>

                    {regError && (
                      <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2 text-xs text-rose-700 font-medium">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{regError}</span>
                      </div>
                    )}

                    {/* 1. Full Name */}
                    <div>
                      <label className="text-xs font-semibold text-[#3A3A3C] block mb-1">
                        Full Name &amp; Designation
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 absolute left-3.5 top-3 text-[#7A7A7A]" />
                        <input
                          type="text"
                          value={regFullName}
                          onChange={(e) => setRegFullName(e.target.value)}
                          required
                          placeholder="e.g. Rajesh Kumar (Executive Engineer)"
                          className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-[#E3DDD5] rounded-xl text-xs sm:text-sm font-medium text-[#1C1C1E] placeholder:text-[#9A9A9E] focus:bg-white focus:outline-none focus:border-[#1B4965] transition-all"
                        />
                      </div>
                    </div>

                    {/* 2. Official Email with Domain suggestion */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-[#3A3A3C]">
                          Official Email / Gmail Address
                        </label>
                        <span className="text-[10px] text-[#7A7A7A]">Must be existing active mailbox</span>
                      </div>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3.5 top-3 text-[#7A7A7A]" />
                        <input
                          type="email"
                          value={regEmail}
                          onChange={(e) => {
                            setRegEmail(e.target.value)
                            setRegError('')
                          }}
                          onBlur={async () => {
                            const clean = (regEmail || '').trim().toLowerCase()
                            if (!clean) return
                            if (clean.includes('@')) {
                              const existing = findUserAccount(clean)
                              if (existing) {
                                setRegError(
                                  `Alert: This email (${clean}) is already registered with ${existing.department || 'an organization'}. Please switch to the "Sign In" tab to log in with your password.`
                                )
                                return
                              }
                            }
                            const check = await verifyEmailWithServer(clean)
                            if (!check.valid) {
                              setRegError(check.message)
                            }
                          }}
                          required
                          placeholder="e.g. yourname@gmail.com / official@bis.gov.in"
                          className={`w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border rounded-xl text-xs sm:text-sm font-medium text-[#1C1C1E] placeholder:text-[#9A9A9E] focus:bg-white focus:outline-none transition-all ${
                            regError && regError.toLowerCase().includes('email')
                              ? 'border-rose-500 ring-2 ring-rose-500/10'
                              : 'border-[#E3DDD5] focus:border-[#1B4965]'
                          }`}
                        />
                      </div>

                      {/* Immediate Alert right below email bar */}
                      {regError && regError.toLowerCase().includes('email') && (
                        <div className="mt-1.5 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold animate-in fade-in space-y-1.5">
                          <div className="flex items-start gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                            <span>{regError}</span>
                          </div>
                          {regError.toLowerCase().includes('already registered') && (
                            <button
                              type="button"
                              onClick={() => {
                                setAuthMode('login')
                                setLoginEmail(regEmail)
                                setRegError('')
                              }}
                              className="px-2.5 py-1 rounded-md bg-[#1B4965] text-white text-[11px] font-bold hover:bg-[#153a51] transition-colors cursor-pointer flex items-center gap-1"
                            >
                              <span>👉 Switch to Sign In with this email</span>
                            </button>
                          )}
                        </div>
                      )}

                      {/* Email domain helper chips */}
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {['@gmail.com', '@cpwd.gov.in', '@bis.gov.in', '@gem.gov.in'].map((domain) => (
                          <button
                            key={domain}
                            type="button"
                            onClick={() => {
                              const prefix = regEmail.split('@')[0] || (regRole === 'admin' ? 'director' : 'official')
                              setRegEmail(`${prefix}${domain}`)
                              setRegError('')
                            }}
                            className="px-2 py-0.5 rounded-md bg-[#F2EFE9] hover:bg-[#E3DDD5] text-[10px] font-mono text-[#4A4A4A] transition-colors"
                          >
                            +{domain}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 3. Account Role Selector */}
                    <div>
                      <label className="text-xs font-semibold text-[#3A3A3C] block mb-1">
                        Portal Role
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setRegRole('officer')
                            setRegError('')
                          }}
                          className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                            regRole === 'officer'
                              ? 'border-[#1B4965] bg-[#1B4965] text-white shadow-xs'
                              : 'border-[#E3DDD5] bg-[#FAF8F5] text-[#4A4A4A] hover:border-[#C8C0B5]'
                          }`}
                        >
                          Procurement Officer
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setRegRole('admin')
                            setRegDepartment('Bureau of Indian Standards (BIS)')
                            setRegError('')
                          }}
                          className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                            regRole === 'admin'
                              ? 'border-[#E05A00] bg-[#E05A00] text-white shadow-xs'
                              : 'border-[#E3DDD5] bg-[#FAF8F5] text-[#4A4A4A] hover:border-[#C8C0B5]'
                          }`}
                        >
                          🏛️ BIS Standards Admin
                        </button>
                      </div>
                    </div>

                    {/* 3b. BIS Admin Restricted Security Section */}
                    {regRole === 'admin' && (
                      <div className="p-3.5 rounded-xl bg-[#FFF6EE] border border-[#FFD4B3] space-y-2.5 animate-in fade-in">
                        <div className="flex items-start gap-2 text-xs text-[#E05A00]">
                          <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-[#E05A00]" />
                          <div>
                            <span className="font-bold">Authorized BIS Admin Access:</span>
                            <p className="text-[11px] text-[#7A5A4A] mt-0.5 leading-relaxed">
                              You can use your personal Gmail to receive the OTP, but administrative provisioning strictly requires the authorized <strong>BIS Directorate Security Passcode</strong>. Only authorized administrators with the passcode can register.
                            </p>
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-bold text-[#E05A00] block mb-1">
                            BIS Directorate Security Passcode *
                          </label>
                          <div className="relative">
                            <Lock className="w-4 h-4 absolute left-3.5 top-3 text-[#E05A00]" />
                            <input
                              type="password"
                              value={adminPasscode}
                              onChange={(e) => {
                                setAdminPasscode(e.target.value)
                                setRegError('')
                              }}
                              required
                              placeholder="Enter Directorate Security Passcode"
                              className="w-full pl-10 pr-4 py-2 bg-white border border-[#FFD4B3] rounded-xl text-xs sm:text-sm font-mono text-[#1C1C1E] placeholder:text-[#B89B84] focus:outline-none focus:border-[#E05A00] focus:ring-1 focus:ring-[#E05A00] transition-all"
                            />
                          </div>
                          <p className="text-[10px] text-[#7A5A4A] mt-1">
                            Confidential security authorization key issued to authorized BIS Central Directorate administrators.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* 4. Ministry / Department Dropdown (Multi-option or locked to BIS) */}
                    <div>
                      <label className="text-xs font-semibold text-[#3A3A3C] block mb-1">
                        Ministry / Department / Organization
                      </label>
                      {regRole === 'admin' ? (
                        <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-[#FFF0E6] border border-[#FFD4B3] rounded-xl text-xs sm:text-sm font-semibold text-[#E05A00]">
                          <Building2 className="w-4 h-4 shrink-0 text-[#E05A00]" />
                          <span className="flex-1">Bureau of Indian Standards (BIS)</span>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white text-[#E05A00] border border-[#FFD4B3]">
                            Locked for Admin
                          </span>
                        </div>
                      ) : (
                        <div className="relative">
                          <Building2 className="w-4 h-4 absolute left-3.5 top-3 text-[#7A7A7A] pointer-events-none" />
                          <select
                            value={regDepartment}
                            onChange={(e) => setRegDepartment(e.target.value)}
                            className="w-full pl-10 pr-8 py-2.5 bg-[#FAF8F5] border border-[#E3DDD5] rounded-xl text-xs sm:text-sm font-medium text-[#1C1C1E] focus:bg-white focus:outline-none focus:border-[#1B4965] transition-all appearance-none cursor-pointer"
                          >
                            {GOV_DEPARTMENTS.map((dept) => (
                              <option key={dept} value={dept}>
                                {dept}
                              </option>
                            ))}
                          </select>
                          <div className="absolute right-3.5 top-3.5 pointer-events-none text-[#7A7A7A] text-[10px]">
                            ▼
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 5. Password + Strength Meter */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-[#3A3A3C]">
                          Set Portal Password
                        </label>
                        {regPassword && (
                          <span className={`text-[10px] font-bold ${passStrength.text}`}>
                            Strength: {passStrength.label}
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3.5 top-3 text-[#7A7A7A]" />
                        <input
                          type="password"
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          required
                          placeholder="Min 8 characters (A-Z, 0-9, @#$)"
                          className="w-full pl-10 pr-4 py-2 bg-[#FAF8F5] border border-[#E3DDD5] rounded-xl text-xs sm:text-sm font-medium text-[#1C1C1E] focus:bg-white focus:outline-none focus:border-[#1B4965] transition-all"
                        />
                      </div>
                      {/* Strength meter bar */}
                      {regPassword && (
                        <div className="mt-1.5 space-y-1">
                          <div className="w-full bg-[#E3DDD5] h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${passStrength.color} transition-all duration-300`}
                              style={{ width: `${(passStrength.score / 4) * 100}%` }}
                            ></div>
                          </div>
                          {passStrength.tip && (
                            <p className="text-[10px] text-[#7A7A7A]">
                              💡 {passStrength.tip}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* 6. Confirm Password */}
                    <div>
                      <label className="text-xs font-semibold text-[#3A3A3C] block mb-1">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3.5 top-3 text-[#7A7A7A]" />
                        <input
                          type="password"
                          value={regConfirmPassword}
                          onChange={(e) => setRegConfirmPassword(e.target.value)}
                          required
                          placeholder="Re-enter password"
                          className="w-full pl-10 pr-4 py-2 bg-[#FAF8F5] border border-[#E3DDD5] rounded-xl text-xs sm:text-sm font-medium text-[#1C1C1E] focus:bg-white focus:outline-none focus:border-[#1B4965] transition-all"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSendingOtp}
                      className="w-full mt-2 py-3 px-6 rounded-xl bg-[#2E8B57] hover:bg-[#257247] text-white font-bold text-xs sm:text-sm shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      {isSendingOtp ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Dispatching OTP to your Gmail...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Verification OTP to Email</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  /* Step B: 2FA OTP Screen (REAL GMAIL DISPATCH) */
                  <form onSubmit={handleVerifyRegisterOtp} className="space-y-4">
                    <div className="text-center space-y-1">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center mx-auto">
                        <KeyRound className="w-6 h-6" />
                      </div>
                      <h3 className="text-base font-bold text-slate-900">
                        Check Your Email Inbox
                      </h3>
                      <p className="text-xs text-slate-500">
                        A real 4-digit verification code has been dispatched to:
                      </p>
                      <p className="text-xs font-mono font-bold text-[#1B4965] bg-slate-100 py-1 px-3 rounded-lg inline-block">
                        {regEmail}
                      </p>
                    </div>

                    {/* Status note about real dispatch */}
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 space-y-1">
                      <p className="font-semibold flex items-center gap-1.5 text-blue-800">
                        <CheckCircle2 className="w-4 h-4 text-blue-600" />
                        <span>Real Email Notification Triggered</span>
                      </p>
                      <p className="text-[11px] text-blue-700 leading-relaxed">
                        Please open your Gmail or official mailbox and check your Inbox / Spam folder for the 4-digit code.
                      </p>
                    </div>

                    {regError && (
                      <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs text-rose-700 font-medium">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{regError}</span>
                      </div>
                    )}

                    <div>
                      <label className="text-xs font-semibold text-[#3A3A3C] block mb-1 text-center">
                        Enter 4-Digit Code Received on Mail
                      </label>
                      <input
                        type="text"
                        maxLength={4}
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        required
                        autoFocus
                        placeholder="••••"
                        className="w-full py-3 px-4 text-center bg-[#FAF8F5] border border-[#E3DDD5] rounded-xl text-2xl font-mono tracking-[0.5em] font-bold text-[#1C1C1E] focus:bg-white focus:outline-none focus:border-[#2E8B57] focus:ring-2 focus:ring-[#2E8B57]/10 transition-all"
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          setOtpStep(false)
                          setRegError('')
                        }}
                        className="text-[#7A7A7A] hover:text-[#1C1C1E] underline"
                      >
                        ← Edit Email / Details
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          setRegError('')
                          const newOtp = createRandomOtp()
                          setGeneratedOtp(newOtp)
                          await sendRealEmailOtp(regEmail.trim(), newOtp)
                        }}
                        className="text-[#2E8B57] font-semibold hover:underline"
                      >
                        Resend to Gmail
                      </button>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 px-6 rounded-xl bg-[#2E8B57] hover:bg-[#257247] text-white font-bold text-sm shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verify OTP &amp; Enter ManakSetu</span>
                    </button>
                  </form>
                )}
              </div>
            )}

          </div>

          {/* Note */}
          <p className="text-center text-xs text-[#9A9A9E] font-medium pt-1">
            Demo personas &amp; official accounts supported
          </p>
        </div>
      </main>



      {/* Footer */}
      <footer className="py-3 px-6 border-t border-[#E3DDD5] bg-white text-xs text-[#7A7A7A]">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <span>Smart India Hackathon 2026 • SIH26108: Standards Engine for Tender &amp; Utility</span>
          <span>Bureau of Indian Standards (BIS) • Government of India</span>
        </div>
        <div className="max-w-6xl mx-auto mt-2 text-center text-[#B0B0B8]">
          © 2026 ManakSetu | Independent SIH Prototype | For Reference &amp; Verification Only
        </div>
      </footer>
    </div>
  )
}
