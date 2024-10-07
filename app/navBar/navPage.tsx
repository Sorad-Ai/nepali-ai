'use client';

import { useState, useRef, useEffect } from 'react';
import './nav-Style.css';
import NavigationScript from './nav-Script';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NavBar() {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [searchIcon, setSearchIcon] = useState<string>('uil-search');
  const inputRef = useRef<HTMLInputElement>(null);
  const openNavBtnRef = useRef<HTMLElement>(null);
  const [query, setQuery] = useState<string>(''); 
  const router = useRouter();

  const toggleVisibility = () => {
    setIsVisible((prev) => !prev); // Toggle search box visibility
    setSearchIcon((prev) => (prev === 'uil-search' ? 'uil-times' : 'uil-search')); // Toggle between search and close icon
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
    setIsVisible(false); // Hide the search box after submitting
    setSearchIcon('uil-search'); // Reset icon to search
  };

  const handleKeyDown = () => {
    // Focus the input field if the search box is visible and any key is pressed
    if (isVisible && inputRef.current && !inputRef.current.contains(document.activeElement)) {
      inputRef.current.focus();
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      if (!document.querySelector('.search-box')?.contains(document.activeElement)) {
        setIsVisible(false);
        setSearchIcon('uil-search'); // Reset icon to search on blur
      }
    }, 0);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isVisible && !document.querySelector('.search-box')?.contains(e.target as Node)) {
        setIsVisible(false);
        setSearchIcon('uil-search'); // Reset icon to search when clicking outside
      }
    };

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown); // Listen for key press when search box is visible

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isVisible]);

  return (
    <nav className="nav">
      <NavigationScript />

      {/* Logo */}
      <i className="uil uil-bars navOpenBtn" ref={openNavBtnRef}></i>
      <Link href="/" className="logo" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
        <Image
          src="https://img.icons8.com/color/200/microsoft.png"
          alt="Logo"
          width={35}
          height={35}
          style={{ marginRight: '10px' }}
        />
        Ai Controls
      </Link>

      {/* List */}
      <ul className={`nav-links ${isVisible ? 'hidden' : ''}`}>
        <i className="uil uil-times navCloseBtn"></i>
        <li>
          <Link href="/apps/home">
            <i className="uil uil-question-circle" style={{ fontSize: '20px', color: '#FFF', paddingRight: '8px' }}></i>Help
          </Link>
        </li>
        <li>
          <Link href="/apps/about">
            <i className="uil uil-info-circle" style={{ fontSize: '20px', color: '#FFF', paddingRight: '8px' }}></i>About
          </Link>
        </li>
        <li>
          <Link href="#">
            <i className="uil uil-envelope" style={{ fontSize: '20px', color: '#FFF', paddingRight: '8px' }}></i>Feedback
          </Link>
        </li>
      </ul>

      {/* Search */}
      <i className={`uil ${searchIcon} search-icon`} id="searchIcon" onClick={toggleVisibility}></i>
      <div className="search-box" style={{ display: isVisible ? 'block' : 'none' }}>
        <form onSubmit={handleSearchSubmit} id="form">
          <input
            type="text"
            id="search-bar"
            className="search-input"
            name="q"
            placeholder="Search by title or keywords..."
            style={{ height: '35px' }}
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onBlur={handleBlur}
          />
          <i className="uil uil-search search-icon" style={{ left: '10px', top: '40%' }}></i>
          <button type="submit" style={{ display: 'none' }}></button>
        </form>
      </div>
    </nav>
  );
}
