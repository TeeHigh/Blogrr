import React, { createContext, useContext, useState, useEffect } from "react";

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  authorAvatar: string;
  publishedAt: string;
  tags: string[];
  readTime: number;
  status: "draft" | "published";
  coverImage?: string;
}

interface BlogContextType {
  posts: BlogPost[];
  addPost: (post: Omit<BlogPost, "id" | "publishedAt">) => void;
  updatePost: (id: string, post: Partial<BlogPost>) => void;
  deletePost: (id: string) => void;
  getPost: (id: string) => BlogPost | undefined;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export function useBlog() {
  const context = useContext(BlogContext);
  if (context === undefined) {
    throw new Error("useBlog must be used within a BlogProvider");
  }
  return context;
}

export function BlogProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    // Initialize with sample posts
    const samplePosts: BlogPost[] = [
      {
        id: "1",
        title: "The Future of Web Development",
        content: `# The Future of Web Development

Web development continues to evolve at a rapid pace. From the rise of modern frameworks to the emergence of new paradigms, developers must stay current with the latest trends and technologies.

## Key Trends to Watch

### 1. Modern JavaScript Frameworks
React, Vue, and Angular continue to dominate the frontend landscape, but newer frameworks like SvelteKit and Solid.js are gaining traction.

### 2. Full-Stack Development
The lines between frontend and backend development continue to blur with frameworks like Next.js, Nuxt.js, and SvelteKit.

### 3. AI Integration
Artificial intelligence is becoming increasingly integrated into development tools and workflows.

The future is bright for web development, with exciting opportunities ahead for developers willing to embrace change and continuous learning.`,
        excerpt:
          "Exploring the latest trends and technologies shaping the future of web development.",
        author: "Sarah Johnson",
        authorAvatar:
          "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150",
        publishedAt: "2024-01-15",
        tags: ["Web Development", "Technology", "JavaScript"],
        readTime: 5,
        status: "published",
        coverImage:
          "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800",
      },
      {
        id: "2",
        title: "Design Systems: Building Consistent UIs",
        content: `# Design Systems: Building Consistent UIs

Design systems are essential for creating consistent, scalable user interfaces across products and teams.

## What is a Design System?

A design system is a collection of reusable components, guided by clear standards, that can be assembled together to build applications.

## Benefits of Design Systems

- **Consistency**: Ensures a unified look and feel
- **Efficiency**: Speeds up development and design processes
- **Scalability**: Easier to maintain and update across projects
- **Collaboration**: Improves communication between design and development teams

Building a design system requires careful planning and ongoing maintenance, but the benefits far outweigh the initial investment.`,
        excerpt:
          "Learn how design systems can help create consistent and scalable user interfaces.",
        author: "Michael Chen",
        authorAvatar:
          "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150",
        publishedAt: "2024-01-12",
        tags: ["Design", "UI/UX", "Development"],
        readTime: 4,
        status: "published",
        coverImage:
          "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800",
      },
      {
        id: "3",
        title: "Getting Started with TypeScript",
        content: `# Getting Started with TypeScript

TypeScript has become an essential tool for JavaScript developers, providing type safety and better development experience.

## Why TypeScript?

TypeScript adds static type definitions to JavaScript, helping catch errors early and improving code quality.

## Key Benefits

- **Type Safety**: Catch errors at compile time
- **Better IDE Support**: Enhanced autocomplete and refactoring
- **Easier Refactoring**: Confident code changes
- **Better Documentation**: Types serve as documentation

Getting started with TypeScript is easier than ever, and the benefits are immediate.`,
        excerpt:
          "A beginner-friendly guide to getting started with TypeScript development.",
        author: "Emily Rodriguez",
        authorAvatar:
          "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150",
        publishedAt: "2024-01-10",
        tags: ["TypeScript", "JavaScript", "Programming"],
        readTime: 3,
        status: "published",
        coverImage:
          "https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=800",
      },
      {
        id: "4",
        title: "Getting Started with Tech",
        content: `# Getting Started with Tech

TypeScript has become an essential tool for JavaScript developers, providing type safety and better development experience.

## Why TypeScript?

TypeScript adds static type definitions to JavaScript, helping catch errors early and improving code quality.

## Key Benefits

- **Type Safety**: Catch errors at compile time
- **Better IDE Support**: Enhanced autocomplete and refactoring
- **Easier Refactoring**: Confident code changes
- **Better Documentation**: Types serve as documentation

Getting started with TypeScript is easier than ever, and the benefits are immediate.`,
        excerpt:
          "A beginner-friendly guide to getting started with TypeScript development.",
        author: "Emily Rodriguez",
        authorAvatar:
          "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150",
        publishedAt: "2024-01-10",
        tags: ["TypeScript", "JavaScript", "Programming"],
        readTime: 3,
        status: "published",
      },
    ];
    setPosts(samplePosts);
  }, []);

  const addPost = (post: Omit<BlogPost, "id" | "publishedAt">) => {
    const newPost: BlogPost = {
      ...post,
      id: Date.now().toString(),
      publishedAt: new Date().toISOString().split("T")[0],
    };
    setPosts((prev) => [newPost, ...prev]);
  };

  const updatePost = (id: string, updatedPost: Partial<BlogPost>) => {
    setPosts((prev) =>
      prev.map((post) => (post.id === id ? { ...post, ...updatedPost } : post))
    );
  };

  const deletePost = (id: string) => {
    setPosts((prev) => prev.filter((post) => post.id !== id));
  };

  const getPost = (id: string) => {
    return posts.find((post) => post.id === id);
  };

  return (
    <BlogContext.Provider
      value={{ posts, addPost, updatePost, deletePost, getPost }}
    >
      {children}
    </BlogContext.Provider>
  );
}
