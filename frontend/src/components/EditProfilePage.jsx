import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const EditProfilePage = () => {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@email.com',
    phone: '',
    dob: '',
    gender: ''
  })

  const [saved, setSaved] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setSaved(false)
  }

  const handleSave = (e) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-24">
      {/* Header */}
      <div className="bg-white px-4 py-3 sticky top-0 z-50 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1">
            <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M15 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className="text-[17px] font-bold text-gray-900">Edit Profile</h1>
        </div>
      </div>

      {/* Avatar Section */}
      <div className="flex flex-col items-center pt-6 pb-4">
        <div className="relative">
          <div className="w-16 h-16 bg-[#006D6D] rounded-full flex items-center justify-center text-white text-[20px] font-bold shadow-lg shadow-[#006D6D]/20">
            {form.firstName.charAt(0)}{form.lastName.charAt(0)}
          </div>
          <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#006D6D] rounded-full flex items-center justify-center shadow">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 012.828 2.828L11.828 15.828a2 2 0 01-1.414.586H8v-2a2 2 0 01.586-1.414z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <p className="text-[11px] text-gray-400 mt-2 font-medium">Tap to change photo</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="px-3 space-y-3">

        {/* Name Row */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-4 pt-3 pb-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">First Name</label>
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="Enter first name"
              className="w-full text-[14px] font-semibold text-gray-800 bg-transparent outline-none py-1.5 placeholder-gray-300"
            />
          </div>
          <div className="h-px bg-gray-50 mx-4"/>
          <div className="px-4 pt-3 pb-3">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Last Name</label>
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Enter last name"
              className="w-full text-[14px] font-semibold text-gray-800 bg-transparent outline-none py-1.5 placeholder-gray-300"
            />
          </div>
        </div>

        {/* Email */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-4 pt-3 pb-3">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter email"
              className="w-full text-[14px] font-semibold text-gray-800 bg-transparent outline-none py-1.5 placeholder-gray-300"
            />
          </div>
        </div>

        {/* Phone */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-4 pt-3 pb-3">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Phone Number</label>
            <input
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              className="w-full text-[14px] font-semibold text-gray-800 bg-transparent outline-none py-1.5 placeholder-gray-300"
            />
          </div>
        </div>

        {/* DOB & Gender Row */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-4 pt-3 pb-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Date of Birth</label>
            <input
              name="dob"
              type="date"
              value={form.dob}
              onChange={handleChange}
              className="w-full text-[14px] font-semibold text-gray-800 bg-transparent outline-none py-1.5 placeholder-gray-300"
            />
          </div>
          <div className="h-px bg-gray-50 mx-4"/>
          <div className="px-4 pt-3 pb-3">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Gender</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full text-[14px] font-semibold text-gray-800 bg-transparent outline-none py-1.5 appearance-none"
            >
              <option value="" disabled>Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not">Prefer not to say</option>
            </select>
          </div>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          className={`w-full py-3.5 rounded-2xl font-black text-[14px] uppercase tracking-wider transition-all duration-300 shadow-md
            ${saved
              ? 'bg-green-500 text-white shadow-green-200'
              : 'bg-[#006D6D] text-white hover:bg-[#005a5a] shadow-[#006D6D]/20'
            }`}
        >
          {saved ? '✓ Changes Saved!' : 'Save Changes'}
        </button>

      </form>
    </div>
  )
}

export default EditProfilePage
