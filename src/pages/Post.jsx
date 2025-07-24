import React from 'react';

const posts = [
  { id: 1, title: "Belajar React", body: "React membuat UI jadi mudah." },
  { id: 2, title: "Deploy ke InfinityFree", body: "Gunakan build static." },
];

export default function Post() {
  return (
    <div className="page post">
      <h1>Postingan Terbaru</h1>
      {posts.map(p => (
        <article key={p.id}>
          <h3>{p.title}</h3>
          <p>{p.body}</p>
        </article>
      ))}
    </div>
  );
}