import Contactt from '@/components/Contactt'
import React from 'react'

const Contact = () => {
  return (
    <div className='h-[100dvh] sm:mt-auto bg-white'>
      <img className="sm:w-1/4 md:w-1/3 lg:w-1/2 hidden sm:block" src="/bw.jpg" style={{ marginLeft: 'auto' }} />
      <img className="h-1/4  sm:hidden block" src="/bw.jpg" />
      <p className='text-white sm:text-black font-extrabold text-5xl md:text-6xl  absolute top-[17%] min-[650px]:top-[18%] left-[12%] sm:left-[5%]'>CONTACT US</p>
      <div className='flex flex-col sm:flex-row items-center justify-center absolute top-[32%] sm:top-[40%] left-[18%] sm:left-[7%] md:left-[5%]'>
        <Contactt />
      </div>
    </div>
  )
}

export default Contact

