"use client"
import React, { useState, useEffect } from 'react';
import PostMain from '@/components/PostMain';
import { Post } from '@/app/types';

const Ids = ({ params }: { params: { id: string } }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/posts/${params.id}`, {
        cache: 'no-store',
      });

      if (!res.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await res.json();
      setPosts(data);
    };

    fetchData();
  }, [params.id]);

  const loadMorePosts = async () => {
    if (loadedCount < 4 && posts.length > 0) {
      const currentIds = posts.map((post) => post.id).join(',');

      try {
        const res = await fetch(`/api/posts/${currentIds}`, {
          cache: 'no-store',
        });

        if (!res.ok) {
          throw new Error('Failed to fetch additional data');
        }

        const additionalPosts = await res.json();

        // Eliminar el primer elemento de los nuevos elementos
        additionalPosts.shift();

        setPosts((prevPosts) => [...prevPosts, ...additionalPosts]);
        setLoadedCount((prevCount) => prevCount + 1);
      } catch (error) {
        console.error('Error loading more posts:', error);
      }
    }
  };



  return (
    <div>
      {posts.map((post: Post, index) => (
        <div key={post.id} className="sm:mt-14 ml-auto">
          <PostMain
            post={{
              id: post.id,
              videoUrl: post.videoUrl,
              description: post.description,
              tag: post.tag,
              views: post.views,
            }}
          />
          {index === posts.length - 1 && loadedCount < 4 && (
            <button onClick={loadMorePosts}>Load More</button>
          )}
        </div>
      ))}
    </div>
  );
};

export default Ids;