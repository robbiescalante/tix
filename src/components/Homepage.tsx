"use client"
import React, { useState, useEffect} from 'react';
import Register from './auth/Register'
import Link from 'next/link';
import { Post } from '@/app/types';

const Homepage = () => {

    // Luego puedes llamar a la función donde sea necesario

    const [post, setPost] = useState<Post | null>(null);

    const getData = async () => {
        const res = await fetch('http://localhost:3000/api/posts', {
            cache: 'no-store',
        });

        if (!res.ok) {
            throw new Error('Failed!');
        }

        return res.json();
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const postData = await getData();
                setPost(postData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();

    }, []); // El segundo argumento vacío indica que solo debe ejecutarse una vez en el montaje del componente

  return (
      <div className="half-image sm:overflow-hidden" >
          <img className="h-[100dvh] mt-14" src="/woman3.jpg" />
          <div className=''>
              <img className="image2 top-[40%] left-[5%] w-[70%] sm:w-[44%] lg:w-[35%] sm:top-[10%] sm:left-[5%]" src="/tixxxw.png" />
          </div>
          <div className='flex items-center absolute top-[72%] sm:top-[65%] left-[38%] sm:left-[45%]'>
              <button
                  className='flex items-center bg-[white] text-black rounded-md px-4 py-2 '>
                  <Link href={`/explore/${post?.id}`} className='mx-4 font-bold text-lg'> Explore </Link>
              </button>
          </div>
      </div>
  )
}

export default Homepage