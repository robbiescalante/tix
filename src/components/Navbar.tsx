"use client"
import React, { useState, useEffect, useRef } from 'react';
import Menu from './Menu';
import Link from 'next/link';
import Image from 'next/image';
import { BiUser } from 'react-icons/bi';
import { FiLogOut } from 'react-icons/fi';
import AuthOverlay from './AuthOverlay';
import { Post } from '@/app/types';
import { authOptions } from './utils/auth';
import {signOut} from 'next-auth/react'
import {useSession} from 'next-auth/react';

const getData = async () => {
  const res = await fetch('http://localhost:3000/api/posts', {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed!');
  }

  return res.json();
};


const Navbar = () => {
  const {data: session} = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [post, setPost] = useState<Post | null>(null);
  const [showAuthOverlay, setShowAuthOverlay] = useState(false);
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
  }, []); // El segundo argumento vacío indica que solo debe ejecutarse una vez en el montaje del componente

  return (
    <div className='bg-transparent h-14 text-white p-4 flex items-center justify-between w-full sm:bg-black sm:shadow-md fixed top-0 left-0 right-0 z-10'>
      {/* LOGO */}
      <div className='px-15 ms-10'>
        <Link href='/'>
          <img className='w-[35px] hidden sm:block' src='/h.png' />
        </Link>
      </div>

      {/* EXPLORE Y CONTACT */}
      <div className='hidden sm:flex gap-4 me-10'>
        <div className='flex items-center'>
          <Link href={`/explore/${post?.id}`}> Explore </Link>
        </div>
        <div className='flex items-center'>
          <Link href='/contact'> Contact </Link>
        </div>

        {/* EMPIEZA SESION */}
        {!session ? (
          <div className='flex items-center'>
            <button
              onClick={() => setShowAuthOverlay(true)}
              className='flex items-center bg-[white]	text-black rounded-md px-3 py-1 '
            >
              <span className='whitespace-nowrap mx-4 font-medium'>Log in</span>
            </button>
          </div>
        ) : (
            <div className='flex items-center' ref={menuRef}>
              <div className='relative'>
                <button
                  className='mt-1 border-2 border-gray-200 rounded-full ml-2'
                  onClick={handleToggleMenu}
                >
                  <BiUser size='20' />
                </button>
                {isMenuOpen && (
                  <div className='absolute bg-neutral-800 rounded-lg py-1.5 w-[200px] shadow-xl top-[40px] right-0 mt-4'>
                    <button className='hover:bg-rose-300 cursor-pointer w-full'>
                      <Link href={`/profile/${session.user.username}`} className='flex items-center w-full justify-start py-3 px-5'>
                          <BiUser size='20' />
                          <span className='pl-2 font-semibold text-sm'>Profile</span>
                      </Link>
                    </button>
                    <button
                      onClick={() => signOut()}
                      className='flex items-center w-full justify-start py-3 px-5 hover:bg-rose-300 cursor-pointer'
                    >
                      <FiLogOut size='20' />
                      <span className='pl-2 font-semibold text-sm'>Log out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
        )}
        {/* TERMINA LO DE SESION */}
      </div>
      {/* MOBILE MENU */}
      <div className='me-5 sm:hidden' style={{ zIndex: 9999 }}>
        <Menu />
      </div>
      {showAuthOverlay && <AuthOverlay onClose={closeAuthOverlay} />}
    </div>
  );
};

export default Navbar;