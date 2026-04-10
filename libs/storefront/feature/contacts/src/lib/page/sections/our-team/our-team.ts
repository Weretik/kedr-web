import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

interface TeamMember {
  name: string;
  roleKey: string;
  image: string;
  socials: string[];
}
@Component({
  selector: 'lib-our-team',
  imports: [NgClass, TranslocoPipe],
  templateUrl: './our-team.html',
  styleUrl: './our-team.css',
})
export class OurTeam {
  teamMembers: TeamMember[] = [
    {
      name: 'Ольга Богуш',
      roleKey: 'contacts.team.role.salesRepresentative',
      image:
        'https://fqjltiegiezfetthbags.supabase.co/storage/v1/render/image/public/block.images/blocks/team/team-9.png',
      socials: ['discord', 'linkedin', 'twitter'],
    },
    {
      name: 'Роман',
      roleKey: 'contacts.team.role.supervisor',
      image:
        'https://fqjltiegiezfetthbags.supabase.co/storage/v1/render/image/public/block.images/blocks/team/team-21.jpg',
      socials: ['discord', 'linkedin', 'twitter'],
    },
    {
      name: 'Антон Іваха',
      roleKey: 'contacts.team.role.doorDirectionManager',
      image:
        'https://fqjltiegiezfetthbags.supabase.co/storage/v1/render/image/public/block.images/blocks/team/team-10.png',
      socials: ['discord', 'linkedin', 'twitter'],
    },
    {
      name: 'Jane Cooper',
      roleKey: 'contacts.team.role.teamLeader',
      image:
        'https://fqjltiegiezfetthbags.supabase.co/storage/v1/render/image/public/block.images/blocks/team/team-12.png',
      socials: ['discord', 'linkedin', 'twitter'],
    },

    {
      name: 'Albert Flores',
      roleKey: 'contacts.team.role.webDesigner',
      image:
        'https://fqjltiegiezfetthbags.supabase.co/storage/v1/render/image/public/block.images/blocks/team/team-13.png',
      socials: ['discord', 'linkedin', 'twitter'],
    },
    {
      name: 'Leona Gunn',
      roleKey: 'contacts.team.role.softwareDeveloper',
      image:
        'https://fqjltiegiezfetthbags.supabase.co/storage/v1/render/image/public/block.images/blocks/team/team-14.png',
      socials: ['discord', 'linkedin', 'twitter'],
    },
    {
      name: 'Aleena Jones',
      roleKey: 'contacts.team.role.softwareTester',
      image:
        'https://fqjltiegiezfetthbags.supabase.co/storage/v1/render/image/public/block.images/blocks/team/team-16.png',
      socials: ['discord', 'linkedin', 'twitter'],
    },
    {
      name: 'Aleena Jones',
      roleKey: 'contacts.team.role.softwareTester',
      image:
        'https://fqjltiegiezfetthbags.supabase.co/storage/v1/render/image/public/block.images/blocks/team/team-22.jpg',
      socials: ['discord', 'linkedin', 'twitter'],
    },
  ];
}
