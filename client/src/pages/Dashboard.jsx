import { Plus, Upload } from 'lucide-react'
import { useState, useEffect } from 'react'
import { dummyResumeData } from '../assets/assets'

const Dashboard = () => {
  const [allResume, setAllResume] = useState([])
  const colors = ['#9333ea', '#d97706', '#dc2626', '#0284c7', '#16a34a']

  const loadAllResumes = async () => {
    
    setAllResume(dummyResumeData)
  }

  useEffect(() => {
    loadAllResumes()
  }, [])
  return (
    <div>
      <div className='max-w-7xl mx-auto px-4 py-8'>
        <p className='text-2xl font-medium mb-6 bg-gradient-to-r from-slate-600 to-slate-700 text-transparent bg-clip-text sm:hidden'>Welcome, Joe Doe </p>

        <div className='flex gap-4'>
          <button className='w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-indigo-500 hover:shadow-lg transition-all duration-300 cursor-pointer '>
            <Plus className='size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-indigo-300 to-indigo-500 text-white rounded-full'/>
            <p className='text-sm group hover:text-indigo-600 transition-all duration-300'>Create Resume</p>
          </button>
          <button className='w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-purple-500 hover:shadow-lg transition-all duration-300 cursor-pointer '>
            <Upload className='size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-purple-300 to-purple-500 text-white rounded-full'/>
            <p className='text-sm group hover:text-purple-600 transition-all duration-300'>Upload Existing Resume</p>
          </button>
        </div>

        <hr className='my-6 border-slate-200 sm:w-[305px]'/>

        <div className='grid grid-cols-2 sm:flex flex-wrap gap-4'>
          {allResume.map((resume) => (
            <ResumeCard key={resume._id} resume={resume}/>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard