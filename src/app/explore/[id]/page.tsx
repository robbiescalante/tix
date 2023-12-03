"use client";
import React, { useState, useEffect, useRef } from 'react';
import PostMain from '@/components/PostMain';
import { Post } from '@/app/types';

const Ids = ({ params }: { params: { id: string } }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  const loadMorePosts = async () => {
    if (loadedCount < 3 && posts.length > 0) {
      const currentIds = posts.map((post) => post.id).join(',');

      try {
        const res = await fetch(`/api/posts/${currentIds}`, {
          cache: 'no-store',
        });

        if (!res.ok) {
          throw new Error('Failed to fetch additional data');
        }

        const additionalPosts = await res.json();

        additionalPosts.shift();

        setPosts((prevPosts) => [...prevPosts, ...additionalPosts]);
        setLoadedCount((prevCount) => prevCount + 1);
      } catch (error) {
        console.error('Error loading more posts:', error);
      }
    }
  };

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

  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (container) {
        const scrollPosition = container.scrollTop;
        const windowHeight = container.clientHeight;
        const scrollHeight = container.scrollHeight;

        const index = Math.floor((scrollPosition + windowHeight / 2) / windowHeight);
        setCurrentVideoIndex(index);

        if (scrollPosition + windowHeight >= scrollHeight && loadedCount < 4) {
          loadMorePosts();
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [containerRef, loadedCount, loadMorePosts]);

  useEffect(() => {
    const currentPost = posts[currentVideoIndex];
    if (currentPost) {
      const videoId = currentPost.id;
      window.history.replaceState(null, '', `/explore/${videoId}`);
    }
  }, [currentVideoIndex, posts]);

  return (
    <div className='scroll-container' ref={containerRef}>
      {posts.map((post: Post, index) => (
        <div key={post.id} className="sm:pt-14 ml-auto" style={{ scrollSnapAlign: 'start' }}>
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
            <div></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Ids;




