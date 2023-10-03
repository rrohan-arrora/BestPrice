"use client";

import Image from "next/image"
import Link from "next/link"

const navIcons: {
    src: string;
    alt: string;
    }[] = [
    {src: "/assets/icons/search.svg", alt: "search"},
    {src: "/assets/icons/red-heart.svg", alt: "heart"},
    {src: "/assets/icons/user.svg", alt: "user"}

]

const Navbar = () => {
  return (
    <header className="w-full">
        <nav className="nav">
            <Link href="/" className="flex items-center gap-1">
                <Image
                    src="/assets/icons/logo.svg"
                    width={50}
                    height={50}
                    alt="logo"
                />
                <p className="nav-logo mt-3">
                    Best<span className="text-primary">Price</span>
                </p>
            </Link>
            <div className="flex items-center gap-5">
            {navIcons.map(navIcon => (
                <Image
                    src={navIcon.src}
                    alt={navIcon.alt}
                    key={navIcon.alt}
                    width={28}
                    height={28}
                    className="object-contain" />
            ))}
            </div>
        </nav>
    </header>
    )
}

export default Navbar