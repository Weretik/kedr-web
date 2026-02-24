import { Component } from '@angular/core';
import { PageHeader, PageHeaderConfig } from '@storefront/ui';

interface Blog {
  category: string;
  title: string;
  description: string;
  date: string;
  cover: string;
}

@Component({
  selector: 'lib-articles',
  imports: [PageHeader],
  templateUrl: './articles.html',
  styleUrl: './articles.css',
})
export class Articles {
  headerConfig: PageHeaderConfig = {
    title: 'Статті',
    breadcrumbs: [{ label: 'Про нас' }, { label: 'Статті' }],
    showSearch: false,
  };

  blogs: Blog[] = [
    {
      category: 'Good News',
      title: 'Our Four-Legged Warriors',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',
      date: '3 days ago',
      cover:
        'https://fqjltiegiezfetthbags.supabase.co/storage/v1/render/image/public/block.images/blocks/blog/blog-4.jpg',
    },
    {
      category: 'Science',
      title: 'Can We Learn From Horses?',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',
      date: '5 days ago',
      cover:
        'https://fqjltiegiezfetthbags.supabase.co/storage/v1/render/image/public/block.images/blocks/blog/blog-5.jpg',
    },
    {
      category: 'Good News',
      title: 'Sky-High Good Vibes',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',
      date: '3 days ago',
      cover:
        'https://fqjltiegiezfetthbags.supabase.co/storage/v1/render/image/public/block.images/blocks/blog/blog-bird.jpg',
    },
    {
      category: 'Science',
      title: 'A Taller Perspective',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',
      date: '5 days ago',
      cover:
        'https://fqjltiegiezfetthbags.supabase.co/storage/v1/render/image/public/block.images/blocks/blog/blog-giraffe.jpg',
    },
    {
      category: 'Science',
      title: 'Can We Learn From Horses?',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',
      date: '5 days ago',
      cover:
        'https://fqjltiegiezfetthbags.supabase.co/storage/v1/render/image/public/block.images/blocks/blog/blog-5.jpg',
    },
    {
      category: 'Good News',
      title: 'Sky-High Good Vibes',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',
      date: '3 days ago',
      cover:
        'https://fqjltiegiezfetthbags.supabase.co/storage/v1/render/image/public/block.images/blocks/blog/blog-bird.jpg',
    },
    {
      category: 'Science',
      title: 'A Taller Perspective',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',
      date: '5 days ago',
      cover:
        'https://fqjltiegiezfetthbags.supabase.co/storage/v1/render/image/public/block.images/blocks/blog/blog-giraffe.jpg',
    },
  ];
}
