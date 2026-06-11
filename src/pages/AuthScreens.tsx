import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button, Card } from '../components/Shared';
import {
  ArrowRight,
  Mail,
  Lock,
  User,
  CheckCircle2,
  Sparkles,
  Target,
  TrendingUp } from
'lucide-react';
// 1. Splash Screen
export const Splash = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => navigate('/onboarding-1'), 2500);
    return () => clearTimeout(timer);
  }, [navigate]);
  return (
    <div className="min-h-screen bg-indigo-600 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{
          scale: 0.8,
          opacity: 0
        }}
        animate={{
          scale: 1,
          opacity: 1
        }}
        transition={{
          duration: 0.5,
          ease: 'easeOut'
        }}
        className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-2xl">
        
        <span className="text-indigo-600 font-bold text-5xl">A</span>
      </motion.div>
      <motion.h1
        initial={{
          y: 20,
          opacity: 0
        }}
        animate={{
          y: 0,
          opacity: 1
        }}
        transition={{
          delay: 0.3
        }}
        className="text-3xl md:text-4xl font-bold text-white text-center tracking-tight">
        
        AInterview
      </motion.h1>
      <motion.p
        initial={{
          y: 20,
          opacity: 0
        }}
        animate={{
          y: 0,
          opacity: 1
        }}
        transition={{
          delay: 0.5
        }}
        className="text-indigo-200 mt-3 text-lg text-center max-w-xs">
        
        AI-powered interview confidence
      </motion.p>
    </div>);

};
// Shared Onboarding Layout
const OnboardingLayout = ({ step, title, desc, icon: Icon, nextPath }: any) =>
<div className="min-h-screen bg-white flex flex-col">
    <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-md mx-auto w-full text-center">
      <motion.div
      initial={{
        scale: 0.8,
        opacity: 0
      }}
      animate={{
        scale: 1,
        opacity: 1
      }}
      className="w-32 h-32 bg-indigo-50 rounded-full flex items-center justify-center mb-8">
      
        <Icon className="w-16 h-16 text-indigo-600" />
      </motion.div>
      <motion.h2
      initial={{
        y: 20,
        opacity: 0
      }}
      animate={{
        y: 0,
        opacity: 1
      }}
      className="text-2xl font-bold text-slate-900 mb-4">
      
        {title}
      </motion.h2>
      <motion.p
      initial={{
        y: 20,
        opacity: 0
      }}
      animate={{
        y: 0,
        opacity: 1
      }}
      transition={{
        delay: 0.1
      }}
      className="text-slate-500 text-lg mb-12">
      
        {desc}
      </motion.p>

      <div className="flex gap-2 mb-12">
        {[1, 2, 3].map((i) =>
      <div
        key={i}
        className={`h-2 rounded-full transition-all ${i === step ? 'w-8 bg-indigo-600' : 'w-2 bg-slate-200'}`} />

      )}
      </div>

      <div className="w-full space-y-4">
        <Link to={nextPath} className="w-full block">
          <Button size="lg" className="w-full group">
            {step === 3 ? 'Get Started' : 'Continue'}
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
        {step < 3 &&
      <Link
        to="/signin"
        className="block text-slate-500 font-medium hover:text-slate-900 transition-colors">
        Skip
      </Link>
      }
      </div>
    </div>
  </div>;

// 2. Onboarding 1
export const Onboarding1 = () =>
<OnboardingLayout
  step={1}
  title="Practice with realistic AI interviewers"
  desc="Experience lifelike interviews tailored to your target role and company."
  icon={Sparkles}
  nextPath="/onboarding-2" />;


// 3. Onboarding 2
export const Onboarding2 = () =>
<OnboardingLayout
  step={2}
  title="Get instant, personalized feedback"
  desc="Receive actionable insights on your content, delivery, and body language."
  icon={Target}
  nextPath="/onboarding-3" />;


// 4. Onboarding 3
export const Onboarding3 = () =>
<OnboardingLayout
  step={3}
  title="Track confidence & performance"
  desc="Watch your skills grow over time with detailed analytics and progress tracking."
  icon={TrendingUp}
  nextPath="/setup-basic" />;


// 5. Sign In
export const SignIn = () =>
<div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div className="sm:mx-auto sm:w-full sm:max-w-md">
      <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
        <span className="text-white font-bold text-2xl">A</span>
      </div>
      <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900">
        Welcome back
      </h2>
      <p className="mt-2 text-center text-sm text-slate-600">
        Need an account? Start setup below.
      </p>
    </div>
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <Card className="py-8 px-4 sm:px-10">
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Email address
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <input
              type="email"
              className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="you@example.com" />
            
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Password
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
              type="password"
              className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="••••••••" />
            
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
              id="remember-me"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded" />
            
              <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-slate-900">
              
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <Link
              to="/forgot-password"
              className="font-medium text-indigo-600 hover:text-indigo-500">
              
                Forgot password?
              </Link>
            </div>
          </div>
          <Link to="/dashboard" className="block">
            <Button size="lg" className="w-full">
              Sign in
            </Button>
          </Link>
        </form>
      </Card>
    </div>
  </div>;

// 6. Sign Up
export const SignUp = () =>
<div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div className="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900">
        Create your account
      </h2>
      <p className="mt-2 text-center text-sm text-slate-600">
        Already have an account?{' '}
        <Link
        to="/signin"
        className="font-medium text-indigo-600 hover:text-indigo-500">
        
          Sign in
        </Link>
      </p>
    </div>
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <Card className="py-8 px-4 sm:px-10">
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Full name
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-400" />
              </div>
              <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Alex Chen" />
            
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Email address
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <input
              type="email"
              className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="you@example.com" />
            
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Password
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
              type="password"
              className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="••••••••" />
            
            </div>
          </div>
          <Link to="/setup-basic" className="block">
            <Button size="lg" className="w-full">
              Create account
            </Button>
          </Link>
        </form>
      </Card>
    </div>
  </div>;

// 7. Forgot Password
export const ForgotPassword = () =>
<div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div className="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900">
        Reset password
      </h2>
      <p className="mt-2 text-center text-sm text-slate-600">
        Enter your email and we'll send you a reset link.
      </p>
    </div>
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <Card className="py-8 px-4 sm:px-10">
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Email address
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <input
              type="email"
              className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="you@example.com" />
            
            </div>
          </div>
          <Link to="/signin" className="block">
            <Button size="lg" className="w-full">
              Send reset link
            </Button>
          </Link>
          <div className="text-center">
            <Link
            to="/signin"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
            
              Back to sign in
            </Link>
          </div>
        </form>
      </Card>
    </div>
  </div>;

// 8. Verify OTP
export const VerifyOTP = () => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-6 h-6 text-indigo-600" />
        </div>
        <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900">
          Check your email
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          We sent a 6-digit code to alex@example.com
        </p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-8 px-4 sm:px-10">
          <div className="flex justify-between gap-2 mb-8">
            {code.map((digit, i) =>
            <input
              key={i}
              type="text"
              maxLength={1}
              className="w-12 h-14 text-center text-2xl font-bold border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="0" />

            )}
          </div>
          <Link to="/setup-basic" className="block">
            <Button size="lg" className="w-full">
              Verify email
            </Button>
          </Link>
          <p className="mt-6 text-center text-sm text-slate-600">
            Didn't receive the code?{' '}
            <button className="font-medium text-indigo-600 hover:text-indigo-500">
              Click to resend
            </button>
          </p>
        </Card>
      </div>
    </div>);

};