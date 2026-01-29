import React from 'react'

const Title = ({title, description}) => {
  return (
    <div className="flex flex-col items-center my-10 scroll-mt-12" >
        <h1 className="text-4xl font-bold text-slate-700">{title}</h1>
        <p className="text-slate-600">{description}</p>
    </div>
  )
}

export default Title