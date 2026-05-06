import { ShoppingBag, Zap, Shield, Globe, Award, Headphones } from 'lucide-react';

export const INITIAL_SERVICES = [
  {
    id: 'consulting',
    name: 'Business Consulting',
    description: 'Expert advice to scale your business and optimize operations.',
    icon: Zap
  },
  {
    id: 'digital-marketing',
    name: 'Digital Marketing',
    description: 'Comprehensive strategies to boost your online presence and sales.',
    icon: Globe
  },
  {
    id: 'security-audit',
    name: 'Security Audit',
    description: 'Protect your digital assets with our thorough security checks.',
    icon: Shield
  },
  {
    id: 'custom-software',
    name: 'Custom Software',
    description: 'Tailored software solutions built with cutting-edge technology.',
    icon: Award
  }
];

export const INITIAL_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Enterprise Dashboard',
    description: 'A powerful dashboard for managing all your business metrics in one place.',
    price: 99.99,
    category: 'Software',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'prod-2',
    name: 'CRM Connector',
    description: 'Seamlessly sync your customer data across all your favorite platforms.',
    price: 49.99,
    category: 'Software',
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'prod-3',
    name: 'Cloud Booster Pack',
    description: 'Essential tools to optimize your cloud infrastructure and reduce costs.',
    price: 149.99,
    category: 'Cloud',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80'
  }
];
