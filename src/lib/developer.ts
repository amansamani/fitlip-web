/**
 * Developer credit + contact links shown in the "Built by" section and footer.
 * Replace every YOUR_* value below. Any link that still contains "YOUR_" is hidden automatically.
 */
export const developer = {
  name: 'Aman Samani',
  role: 'Full-stack & AI developer',
  blurb: 'I build FitLip and this website. For feedback, bug reports or work enquiries, reach out on any of these.',
  links: [
    { id: 'github', label: 'GitHub', href: 'https://github.com/amansamani', display: 'github.com/amansamani' },
    { id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/aman-samani', display: 'linkedin.com/in/aman-samani' },
    { id: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/aman.script', display: '@aman.script' },
    { id: 'email', label: 'Gmail', href: 'mailto:amanworkinfo@gmail.com', display: 'amanworkinfo@gmail.com' },
  ],
} as const;

export type DeveloperLinkId = (typeof developer.links)[number]['id'];