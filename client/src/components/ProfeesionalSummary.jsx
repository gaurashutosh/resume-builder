import { Sparkle, Sparkles } from 'lucide-react'
import React from 'react'

const ProfeesionalSummary = ({data,onChange,setResumeData}) => {
  return (
    <div className='space-y-4'>
        <div className='flex item-center justify-between'>
            <div>
                <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>Profeesional Summary</h3>
                <p className='text-sm text-gray-500'>Add a short summary of your professional experience and skills.</p>
            </div>
            <button className='flex items-center gap-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover: bg-purple-200 transition-colors disabled:opacity-50'>
                <Sparkles className='size-4' />
               AI Enhance
            </button>
        </div>

        <div className='mt-6'>
            <textarea rows={7} value={data || ""} onChange={(e) => onChange(e.target.value)} name="" id="" className='w-full p-3 px-4 mt-2 border text-sm border-gray-300 rounded-lg focus:border-blue-500 outline-none transition-colors resize-none' placeholder='Write a compelling professional summary of your skills and experience...'></textarea>
            <p className='text-xs text-gray-500 max-w-4/5 mx-auto text-center'>Keep it concise and focused on your key achievements and qualifications.</p>
        </div>



    </div>
  )
}

export default ProfeesionalSummary