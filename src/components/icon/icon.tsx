import { cn } from '@/utils';
import type { IconProps as IconifyIconProps } from '@iconify/react';
import { Icon as IconifyIcon } from '@iconify/react';
import type { CSSProperties } from 'react';

interface IconProps extends IconifyIconProps {
  /**
   * Icon name or path
   * - Local SVG: local:icon-name
   * - URL SVG: url:https://example.com/icon.svg
   * - Third-party icon library: iconify-icon-name
   */
  icon: string;
  size?: string | number;
  color?: string;
  className?: string;
  style?: CSSProperties;
}

export default function Icon({
  icon,
  size = '1em',
  color = 'currentColor',
  className = '',
  style = {},
  ...props
}: IconProps) {
  // Handle URL SVG
  if (icon.startsWith('url:')) {
    const url = icon.replace('url:', '');
    return (
      <img
        src={url}
        alt="icon"
        className={cn('inline-block', className)}
        style={{
          width: size,
          height: size,
          color,
          ...style,
        }}
      />
    );
  }

  // Handle local and third-party icon libraries
  return (
    <IconifyIcon
      icon={icon}
      width={size}
      height={size}
      className={cn('inline-block', className)}
      style={{
        color,
        height: size,
        width: size,
        ...style,
      }}
      {...props}
    />
  );
}

export const iconExpanded = (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14.375 8.42188L9.89844 12.7109C9.75781 12.8281 9.61719 12.875 9.5 12.875C9.35938 12.875 9.21875 12.8281 9.10156 12.7344L4.60156 8.42188C4.36719 8.21094 4.36719 7.83594 4.57812 7.625C4.78906 7.39062 5.16406 7.39062 5.375 7.60156L9.5 11.5391L13.6016 7.60156C13.8125 7.39062 14.1875 7.39062 14.3984 7.625C14.6094 7.83594 14.6094 8.21094 14.375 8.42188Z"
      fill="#595959"
    />
  </svg>
);

export const iconCollapsed = (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7.89844 4.625L12.1875 9.10156C12.2812 9.21875 12.3516 9.35938 12.3516 9.5C12.3516 9.64062 12.2812 9.78125 12.1875 9.875L7.89844 14.3516C7.6875 14.5859 7.3125 14.5859 7.10156 14.375C6.86719 14.1641 6.86719 13.8125 7.07812 13.5781L11.0156 9.47656L7.07812 5.39844C6.86719 5.1875 6.86719 4.8125 7.10156 4.60156C7.3125 4.39062 7.6875 4.39062 7.89844 4.625Z"
      fill="#595959"
    />
  </svg>
);

export const iconWarningDelete = (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="48" height="48" rx="24" fill="#FF7875"></rect>
    <path
      d="M34.7422 30.668L25.5898 15.0273C24.8594 13.8242 23.0977 13.8242 22.4102 15.0273L13.2148 30.668C12.5273 31.8711 13.3867 33.375 14.8047 33.375H33.1523C34.5703 33.375 35.4297 31.8711 34.7422 30.668ZM22.9688 19.9688C22.9688 19.4102 23.3984 18.9375 24 18.9375C24.5586 18.9375 25.0312 19.4102 25.0312 19.9688V25.4688C25.0312 26.0703 24.5586 26.5 24 26.5C23.4844 26.5 22.9688 26.0703 22.9688 25.4688V19.9688ZM24 30.625C23.2266 30.625 22.625 30.0234 22.625 29.293C22.625 28.5625 23.2266 27.9609 24 27.9609C24.7305 27.9609 25.332 28.5625 25.332 29.293C25.332 30.0234 24.7305 30.625 24 30.625Z"
      fill="white"
    ></path>
  </svg>
);
