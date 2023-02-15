import clsx from "clsx";
import React, { ReactNode } from "react";

interface IMainLayoutProps {
  children: ReactNode;
  className?: string;
}

export default function MainLayout({ children, className }: IMainLayoutProps) {
  return (
    <main
      className={clsx(
        "flex flex-col min-w-screen min-h-screen w-full h-full",
        className
      )}
    >
      {children}
    </main>
  );
}
