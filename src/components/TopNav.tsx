'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiClock, FiPlus } from 'react-icons/fi';
import AddToolForm from './AddToolForm';

export default function TopNav() {
  const pathname = usePathname();
  const [showAddForm, setShowAddForm] = useState(false);

  const navItems = [
    { href: '/news', icon: FiClock, label: '工具资讯' },
  ];

  return (
    <>
      <nav className="fixed top-0 right-0 left-64 h-16 bg-white/80 backdrop-blur-sm border-b border-gray-200 z-40">
        <div className="h-full max-w-6xl mx-auto px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                    ${isActive 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <FiPlus className="w-5 h-5" />
              <span>增加工具</span>
            </button>
          </div>
        </div>
      </nav>

      {showAddForm && (
        <div className="fixed inset-0 z-[100]">
          <AddToolForm 
            onClose={() => setShowAddForm(false)}
            onSuccess={() => {
              setShowAddForm(false);
              window.location.reload();
            }}
          />
        </div>
      )}
    </>
  );
} 