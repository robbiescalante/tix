"use client"
import React, { useState, useEffect, useRef } from 'react';
import { Post } from '@/app/types';
import Link from 'next/link';
import { BiMenu, BiUser } from "react-icons/bi";
import { RxCross1 } from "react-icons/rx";
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react'
import AuthOverlay from './AuthOverlay';


const getData = async () => {
  const res = await fetch('http://localhost:3000/api/posts', {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed!');
  }

  return res.json();
};

const Menu = () => {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [showAuthOverlay, setShowAuthOverlay] = useState(false);
  const [post, setPost] = useState<Post | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const closeAuthOverlay = () => {
    setShowAuthOverlay(false);
  };

  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current) {
      const targetNode = event.target as Node | null;

      // Check if the target is a node
      if (targetNode && !menuRef.current.contains(targetNode)) {
        // Clicked outside the menu, close the menu
        setIsMenuOpen(false);
      }
    }
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

    // Monitorear la sesión aquí
    document.addEventListener('click', handleClickOutside);

    // Limpiar el controlador de clic al desmontar el componente
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className='mt-12 z-50'>
      <div className='absolute px-15 ms-10 left-0'>
        <Link href="/">
          <img className="w-[42px]" src="/h.png" />
        </Link>
      </div>
        {!open ? (
        <div className='bg-neutral-800 bg-opacity-40 hover:bg-opacity-80 p-2 rounded-full shadow-md'>
          <BiMenu className='text-white hover:text-rose-300' size="28" onClick={()=>setOpen(true)}/>
          </div>
        ) : (
          <div className='bg-neutral-800 bg-opacity-80 p-2 rounded-full'>
            <RxCross1 className='text-white hover:text-rose-300' size="28" onClick={() => setOpen(false)} />
          </div>
        )}
          {open && (
        <div className='bg-neutral-800 bg-opacity-80 rounded-lg shadow-xl text-white font-semibold text-sm absolute right-12 top-22 flex flex-col gap-5 items-center justify-center mt-3 px-10 py-3 z-10'>
          <button className='flex items-center w-full  justify-center pt-3 hover:text-rose-300 cursor-pointer'>
            <Link href={`/explore/${post?.id}`}> Explore </Link>
          </button>
          <button className='flex items-center w-full justify-center py-1 hover:text-rose-300 cursor-pointer'>
            <Link href="/contact"> Contact
            </Link>
          </button>

            {/* EMPIEZA SESION */}
            {!session ? (
              <div className='flex items-center'>
                <button
                  onClick={() => setShowAuthOverlay(true)}
                className='flex items-center w-full justify-center py-1 hover:text-rose-300 cursor-pointer'>
                  <span
                    className='whitespace-nowrap mx-4 font-medium'>Log in</span>
                </button>
              </div>
            ) : (
                  <div>
                    <button className='flex items-center w-full justify-center pb-3 hover:text-rose-300 cursor-pointer'>
                  <Link href={`/profile/${session.user.username}`} className=''>
                      <span className='font-semibold text-sm'>Profile</span>
                    </Link>
                    </button>
                    <button 
                    onClick={() => signOut()}
                    className='flex items-center w-full justify-center py-3 hover:text-rose-300 cursor-pointer'>
                      <span className='font-semibold text-sm'>Log out</span>
                    </button>
                  </div>
            )}
            {/* TERMINA LO DE SESION */}
        </div>
        )}
      {showAuthOverlay && <AuthOverlay onClose={closeAuthOverlay} />}
    </div>
  )
}

export default Menu
