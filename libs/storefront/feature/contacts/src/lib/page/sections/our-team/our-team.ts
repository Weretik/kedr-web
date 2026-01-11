import { NgClass } from '@angular/common';
import { Component } from '@angular/core';

interface TeamMember {
  name: string;
  role: string;
  image: string;
  socials: string[];
}
@Component({
  selector: 'lib-our-team',
  imports: [NgClass],
  templateUrl: './our-team.html',
  styleUrl: './our-team.css',
})
export class OurTeam {
  teamMembers: TeamMember[] = [
    {
      name: 'Ольга Богуш',
      role: 'Торговим представником',
      image:
        'https://fqjltiegiezfetthbags.supabase.co/storage/v1/render/image/public/block.images/blocks/team/team-9.png',
      socials: ['discord', 'linkedin', 'twitter'],
    },
    {
      name: 'Роман',
      role: 'Супервайзер',
      image:
        'https://fqjltiegiezfetthbags.supabase.co/storage/v1/render/image/public/block.images/blocks/team/team-21.jpg',
      socials: ['discord', 'linkedin', 'twitter'],
    },
    {
      name: 'Антон Іваха',
      role: 'Менеджер дверного напрямку',
      image:
        'https://fqjltiegiezfetthbags.supabase.co/storage/v1/render/image/public/block.images/blocks/team/team-10.png',
      socials: ['discord', 'linkedin', 'twitter'],
    },
    {
      name: 'Jane Cooper',
      role: 'Team Leader',
      image:
        'https://fqjltiegiezfetthbags.supabase.co/storage/v1/render/image/public/block.images/blocks/team/team-12.png',
      socials: ['discord', 'linkedin', 'twitter'],
    },

    {
      name: 'Albert Flores',
      role: 'Web Designer',
      image:
        'https://fqjltiegiezfetthbags.supabase.co/storage/v1/render/image/public/block.images/blocks/team/team-13.png',
      socials: ['discord', 'linkedin', 'twitter'],
    },
    {
      name: 'Leona Gunn',
      role: 'Software Developer',
      image:
        'https://fqjltiegiezfetthbags.supabase.co/storage/v1/render/image/public/block.images/blocks/team/team-14.png',
      socials: ['discord', 'linkedin', 'twitter'],
    },
    {
      name: 'Aleena Jones',
      role: 'Software Tester',
      image:
        'https://fqjltiegiezfetthbags.supabase.co/storage/v1/render/image/public/block.images/blocks/team/team-16.png',
      socials: ['discord', 'linkedin', 'twitter'],
    },
    {
      name: 'Aleena Jones',
      role: 'Software Tester',
      image:
        'https://fqjltiegiezfetthbags.supabase.co/storage/v1/render/image/public/block.images/blocks/team/team-22.jpg',
      socials: ['discord', 'linkedin', 'twitter'],
    },
  ];
}
