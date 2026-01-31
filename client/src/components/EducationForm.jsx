import React from 'react'

const EducationForm = ({data,onChange}) => {

    const addEducation = () => {
        const newEducation = {
            institute: "",
            degree: "",
            field_of_study: "",
            graduation_date: "",
            gpa: "",
        }
        onChange([...data, newEducation]);
    }

    const removeEducation = (index) => {
        const updated = data.filter((_, i) => i !== index);
        onChange(updated);
    }

    const updateEducation = (index, field,value) => {
        const updated = [...data];
        updated[index] ={...updated[index], [field]: value};
        onChange(updated);
    }

  return (
    <div>
            <div className='flex item-center justify-between'>
            <div>
                <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>Education</h3>
                <p className='text-sm text-gray-500'>Add your education details</p>
            </div>
            <button onClick={addEducation} className='flex items-center gap-2 px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover: bg-green-200 transition-colors '>
                <Plus className='size-4' />
               Add Education
            </button>
        </div>
        </div>

  )
}

export default EducationForm