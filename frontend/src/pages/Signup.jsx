import React, { useState } from 'react'
import { Eye, EyeOff, Mail, MessageSquare, User, Lock, Loader2 } from "lucide-react"
import { Link } from 'react-router-dom'
import AuthImagePattern from '../components/authImagePattern'
import toast from 'react-hot-toast';
import { useAuthStore } from "../store/useAtuthstore.js"

const Signup = () => {

  const {signup, iSigningUp} = useAuthStore()

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: ""
  });

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const success = validateForm();

    if (success === true) signup(formData);
  };
  return (
    <div className='min-h-screen grid lg:grid-cols-2'>
      {/* left side */}
      <div className='w-full p-6 sm:p-12 flex flex-col justify-center items-center space-y-5'>
        <div className='border p-2 bg-violet-900 outline-none border-none rounded-md hover:bg-primary/20'>
          <MessageSquare className="size-6 text-primary" />
        </div>

        <div className='text-2xl font-bold font-sans'> Creat Account </div>

        <div className='text-base font-semibold font-sans'>Get started with your free account</div>

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='form-control'>
            <label className="label">
              <span className="label-text font-medium">Full Name</span>
            </label>
            <div className="relative sm:min-w-96 min-w-70">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="size-5 text-base-content/40" />
              </div>
              <input
                type="text"
                className={`input input-bordered w-full pl-10`}
                placeholder="John Doe"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Email</span>
            </label>
            <div className="relative sm:min-w-96 min-w-70">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="size-5 text-base-content/40" />
              </div>
              <input
                type="email"
                className={`input input-bordered w-full pl-10`}
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Password</span>
            </label>
            <div className="relative sm:min-w-96 min-w-70">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="size-5 text-base-content/40" />
              </div>
              <input
                type={`password`}
                className={`input input-bordered w-full pl-10`}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>
          <button type="submit" disabled={iSigningUp}  className="btn btn-primary w-full">
            {iSigningUp ? (<>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>) : ("Creact Account") }
          </button>
        </form>
        <div className="text-center">
          <p className="text-base-content/60">
            Already have an account?{" "}
            <Link to="/login" className="link link-primary">
              Sign in
            </Link>
          </p>
        </div>
      </div>
      {/* right side */}

      <AuthImagePattern
        title="Join our community"
        subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
      />
    </div>
  )
}

export default Signup


