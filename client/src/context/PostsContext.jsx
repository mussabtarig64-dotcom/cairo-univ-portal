import React, { createContext, useContext, useState, useEffect } from 'react';

const PostsContext = createContext();

export function PostsProvider({ children }) {
  const [posts, setPosts] = useState(() => {
    const saved = localStorage.getItem('portal_posts');
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        title: 'أهلاً بكم في البوابة الإلكترونية لـ رابطة الطلاب السودانيين',
        content: 'نسعد بتقديم خدماتنا الأكاديمية والأنشطة الطلابية لكافة طلاب كلية العلوم - جامعة القاهرة.',
        date: new Date().toLocaleDateString('ar-EG'),
        author: 'الهيئة الإدارية'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('portal_posts', JSON.stringify(posts));
  }, [posts]);

  // إضافة منشور جديد بواسطة الأدمن
  const addPost = (newPost) => {
    const postWithId = {
      ...newPost,
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('ar-EG'),
      author: 'إدارة الرابطة'
    };
    setPosts([postWithId, ...posts]);
  };

  // حذف منشور
  const deletePost = (id) => {
    setPosts(posts.filter(post => post.id !== id));
  };

  return (
    <PostsContext.Provider value={{ posts, addPost, deletePost }}>
      {children}
    </PostsContext.Provider>
  );
}

export const usePosts = () => useContext(PostsContext);