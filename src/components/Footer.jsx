import React from 'react'
import { Link } from 'react-router-dom'
import { socialLinks } from '../constants/constants'
import Auth from '../utils/auth'

const Footer = () => {
  const loggedIn = Auth.loggedIn()

  return (
    <footer className={`${!loggedIn && 'footer-bg-dark'} py-10`}>
      <div className={`${!loggedIn && 'max-w-7xl'} mx-auto px-4 lg:px-8`}>
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between border-t-2 border-gray-300/30 dark:border-gray-700 gap-8">
          {/* Company Info */}
          <div className="flex flex-col sm:flex-row items-center justify-between w-full">
            <div className="text-center sm:text-left mb-4 sm:mb-0">
              <p className="text-sm font-medium">
                &copy; 2024 SignEase, Inc. All rights reserved.
              </p>
              <p className="text-xs">
                123 SignEase Blvd, Suite 100
                <br />
                Innovation City, Techland 12345
              </p>
              <p className="text-xs">
                Email: contact@sign-ease.com | Phone: (123) 456-7890
              </p>
            </div>
            {/* Social Media Links */}
            <div className="flex flex-row flex-wrap justify-center gap-4">
              {socialLinks.map((link) => (
                <a
                  key={`link-${link.title}`}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            Privacy Policy | Terms of Service
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
