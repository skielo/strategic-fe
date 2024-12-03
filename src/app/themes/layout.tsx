'use client';

import PrivateRoute from '../../components/PrivateRoute';

export default function ThemesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PrivateRoute>{children}</PrivateRoute>;
}