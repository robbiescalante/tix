"use client"
import React, { useEffect, useState } from 'react';
import { BiSolidPencil } from 'react-icons/bi';
import { User } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import EditProfileOverlay from '@/components/EditProfile';
import PostLiked from '@/components/PostLiked';
import { Post } from '@/app/types';
import { BiUser } from 'react-icons/bi';

const Profile = ({ params }: { params: { id: string } }) => {
  const [profile, setProfile] = useState<User>();
  const [isEditing, setIsEditing] = useState(false); // Nuevo estado para controlar la edición
  const { data: session } = useSession();
  const router = useRouter();
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);

  const handleEditButtonClick = () => {
    setIsOverlayOpen(true);
  };

  const handleCloseOverlay = () => {
    setIsOverlayOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/profile/${params.id}`, {
          cache: 'no-store',
        });
        

        if (!res.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await res.json();
        setProfile(data);
      } catch (error) {
        console.error(error);
        router.push('/error');
      }
    };

    fetchData();
  }, [params.id, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/likess/${params.id}`, {
          cache: 'no-store',
        });

        if (!res.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await res.json();
        console.log('Data:', data);
        setPosts(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [params.id]);

  useEffect(() => {
    if (!session) {
      // No hay sesión, redirigir a la página de inicio
      router.push('/');
    }
  }, [session, router]);

  if (session?.user.username == profile?.id) {
    return (
      <>
        {isOverlayOpen && profile?.id && (
          <EditProfileOverlay onClose={handleCloseOverlay} id={profile.id} />
        )}

        <div className="ml-8 pt-[100px] pl-[15px] w-[calc(100%-90px)] max-w-[1800px] h-[100vh] ">
          <div className="flex items-center justify-center">
            <div className="w-full flex flex-col items-center">
              <div className='mt-7'>
                <BiUser size='75' />
              </div>
              <div>
                <p className="text-[22px] font-bold truncate text-center mt-2">{profile?.username}</p>
              </div>
              <button
                className="flex items-center rounded-md py-1.5 px-3.5 mt-3 mx-auto text-[12px] font-semibold border hover:bg-gray-100"
                onClick={handleEditButtonClick} // Maneja el clic del botón de edición
              >
                <BiSolidPencil className="mt-0.5 mr-1" size="12" />
                <span>Edit profile</span>
              </button>
            </div>
          </div>
          <div>
            <ul className="w-full flex items-center pt-10 border-b">
              <li className="w-full text-center py-2 text-[17px] font-semibold border-b-2 border-neutral-400">Liked</li>
            </ul>
            <div className="mt-4 grid 2xl:grid-cols-6 xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-3 pb-12">
              {posts.map((post) => (
                <PostLiked key={post.id} post={post} id={profile?.id || ''} />
              ))}
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return <h2 className='text-2xl'></h2>;
  }
};

export default Profile;